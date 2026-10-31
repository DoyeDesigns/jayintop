import { connect, type TLSSocket } from "node:tls";
import type { ContactMessage } from "@/lib/site-store";

const SITE_NAME = process.env.SITE_NAME ?? "Jayintop";
const BRAND_DARK = "#131313";
const BRAND_ORANGE = "#f26a22";
const LOGO_URL =
  process.env.LOGO_URL ?? "https://jayintop.com/favicon/android-chrome-192x192.png";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function row(label: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  return `<tr>
    <td style="padding:12px 16px;border-bottom:1px solid #e4e7ec;background-color:#f9fafb;color:#717680;font-family:Inter,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:12px 16px;border-bottom:1px solid #e4e7ec;color:#181d27;font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.55;vertical-align:top;">${escapeHtml(value)}</td>
  </tr>`;
}

function buildDetailsTable(entries: [string, unknown][]): string {
  const rows = entries.map(([label, value]) => row(label, value)).filter(Boolean).join("");
  if (!rows) {
    return `<p style="margin:0;font-family:Inter,Arial,sans-serif;font-size:15px;color:#535862;">No details provided.</p>`;
  }
  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;border:1px solid #e4e7ec;margin:24px 0 8px;border-collapse:collapse;">${rows}</table>`;
}

function wrapEmailHtml(title: string, intro: string, detailsHtml: string): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:560px;margin:24px auto;background:#fff;border:1px solid #e9eaeb;">
    <div style="background:${BRAND_DARK};padding:24px;text-align:center;">
      <img src="${escapeHtml(LOGO_URL)}" width="48" height="48" alt="${escapeHtml(SITE_NAME)}" style="display:block;margin:0 auto 16px;border:0;" />
      <h1 style="margin:0;font-size:18px;font-weight:600;color:${BRAND_ORANGE};">${escapeHtml(title)}</h1>
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#535862;">${intro}</p>
      ${detailsHtml}
      <p style="margin:24px 0 0;font-size:13px;color:#717680;">&mdash; ${escapeHtml(SITE_NAME)}</p>
    </div>
  </div>
</body>
</html>`;
}

function normalizeRecipient(email: unknown, label: string): string {
  const value = String(email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error(`Invalid ${label} email: ${email}`);
  }
  return value;
}

function smtpUser() {
  return (process.env.SMTP_USER ?? process.env.MIGADU_EMAIL ?? "").trim();
}

function smtpPassword() {
  return (process.env.SMTP_PASSWORD ?? process.env.MIGADU_PASSWORD ?? "").trim();
}

function getFromAddress(): string {
  const from = (process.env.FROM_EMAIL ?? smtpUser())?.trim();
  if (!from) throw new Error("Missing FROM_EMAIL or SMTP_USER.");
  return from;
}

function formatSubmittedAt(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Just now";
  return date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

type SmtpReply = { code: number; text: string };

class SmtpSession {
  private buffer = "";
  private replies: SmtpReply[] = [];
  private waiting: ((reply: SmtpReply) => void) | null = null;
  private failed: ((error: Error) => void) | null = null;

  constructor(private socket: TLSSocket) {
    socket.on("data", (chunk: Buffer) => {
      this.buffer += chunk.toString("utf8");
      this.flush();
    });
    socket.on("error", (error: Error) => {
      this.failed?.(error);
    });
  }

  private flush() {
    const lines = this.buffer.split(/\r?\n/);
    this.buffer = lines.pop() ?? "";
    const complete: string[] = [];
    for (const line of lines) {
      if (!line) continue;
      complete.push(line);
      if (line.length >= 4 && line[3] !== "-") {
        const code = Number(line.slice(0, 3));
        if (!Number.isFinite(code)) continue;
        const reply = { code, text: complete.splice(0).join("\n") };
        if (this.waiting) {
          const resolve = this.waiting;
          this.waiting = null;
          resolve(reply);
        } else {
          this.replies.push(reply);
        }
      }
    }
  }

  expect(expected: number[]) {
    return new Promise<SmtpReply>((resolve, reject) => {
      this.failed = reject;
      const take = (reply: SmtpReply) => {
        if (!expected.includes(reply.code)) {
          reject(new Error(`SMTP ${reply.code}: ${reply.text}`));
          return;
        }
        resolve(reply);
      };
      const queued = this.replies.shift();
      if (queued) {
        take(queued);
        return;
      }
      this.waiting = take;
    });
  }

  send(line: string) {
    return new Promise<void>((resolve, reject) => {
      this.socket.write(`${line}\r\n`, (error) => (error ? reject(error) : resolve()));
    });
  }

  close() {
    this.socket.end();
  }
}

function connectSmtp(): Promise<SmtpSession> {
  const hostname = process.env.SMTP_HOST ?? "smtp.migadu.com";
  const port = Number(process.env.SMTP_PORT ?? "465");
  return new Promise((resolve, reject) => {
    const socket = connect({ host: hostname, port, servername: hostname });
    const session = new SmtpSession(socket);
    socket.once("secureConnect", () => resolve(session));
    socket.once("error", reject);
  });
}

function encodeSubject(subject: string) {
  return `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;
}

function foldHeader(value: string) {
  return value.replace(/\r?\n/g, " ");
}

async function sendMailMessage({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const username = smtpUser();
  const password = smtpPassword();
  if (!username || !password) {
    throw new Error("Missing SMTP_USER or SMTP_PASSWORD.");
  }

  const from = getFromAddress();
  const smtp = await connectSmtp();

  try {
    await smtp.expect([220]);
    await smtp.send("EHLO jayintop.com");
    await smtp.expect([250]);
    await smtp.send("AUTH LOGIN");
    await smtp.expect([334]);
    await smtp.send(Buffer.from(username, "utf8").toString("base64"));
    await smtp.expect([334]);
    await smtp.send(Buffer.from(password, "utf8").toString("base64"));
    await smtp.expect([235]);
    await smtp.send(`MAIL FROM:<${from}>`);
    await smtp.expect([250]);
    await smtp.send(`RCPT TO:<${to}>`);
    await smtp.expect([250, 251]);
    await smtp.send("DATA");
    await smtp.expect([354]);

    const boundary = `jayintop-${Date.now()}`;
    const headers = [
      `From: ${SITE_NAME} <${from}>`,
      `To: ${to}`,
      replyTo ? `Reply-To: ${replyTo}` : null,
      `Subject: ${encodeSubject(subject)}`,
      `Date: ${new Date().toUTCString()}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ]
      .filter(Boolean)
      .map((line) => foldHeader(line as string));

    const body = [
      ...headers,
      "",
      `--${boundary}`,
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      html.replace(/\r?\n/g, "\r\n").replace(/^\./gm, ".."),
      `--${boundary}--`,
      ".",
    ].join("\r\n");

    await smtp.send(body.replace(/\r?\n$/, ""));
    await smtp.expect([250]);
    await smtp.send("QUIT");
    await smtp.expect([221, 250]).catch(() => undefined);
  } finally {
    smtp.close();
  }
}

async function sendRoleMail(
  role: "user" | "admin",
  slot: { status: string; to: string; error?: string },
  payload: { to: string; subject: string; html: string; replyTo?: string },
) {
  try {
    await sendMailMessage(payload);
    slot.status = "sent";
  } catch (err) {
    slot.status = "failed";
    slot.error = err instanceof Error ? err.message : String(err);
    console.error(`[contact-mail] ${role} mail failed:`, payload.to, err);
  }
}

export async function sendContactEmails(message: ContactMessage, fallbackAdminEmail?: string) {
  const adminEmail = normalizeRecipient(
    process.env.ADMIN_EMAIL || fallbackAdminEmail,
    "ADMIN_EMAIL",
  );
  const userEmail = normalizeRecipient(message.email, "user");
  const fullName = `${message.firstName} ${message.lastName}`.trim();
  const details = buildDetailsTable([
    ["Submitted", formatSubmittedAt(message.createdAt)],
    ["First name", message.firstName],
    ["Last name", message.lastName],
    ["Email", message.email],
    ["Phone", message.phone],
    ["Message", message.message],
  ]);

  const adminHtml = wrapEmailHtml(
    "New contact message",
    `A new contact message was submitted on ${escapeHtml(SITE_NAME)}.`,
    details,
  );
  const userHtml = wrapEmailHtml(
    "Thank you",
    `Hi ${escapeHtml(message.firstName || "there")},<br><br>Thank you for contacting ${escapeHtml(SITE_NAME)}. Here is a copy of what you submitted:`,
    details,
  );

  const delivery = {
    user: { status: "pending", to: userEmail } as { status: string; to: string; error?: string },
    admin: { status: "pending", to: adminEmail } as { status: string; to: string; error?: string },
  };

  if (adminEmail === userEmail) {
    await sendRoleMail("admin", delivery.admin, {
      to: adminEmail,
      subject: `New contact message: ${fullName}`,
      html: adminHtml,
      replyTo: userEmail,
    });
    delivery.user.status = "skipped";
    delivery.user.error = "Same address as admin; one notification sent.";
  } else {
    await Promise.all([
      sendRoleMail("user", delivery.user, {
        to: userEmail,
        subject: `We received your message — ${SITE_NAME}`,
        html: userHtml,
      }),
      sendRoleMail("admin", delivery.admin, {
        to: adminEmail,
        subject: `New contact message: ${fullName}`,
        html: adminHtml,
        replyTo: userEmail,
      }),
    ]);
  }

  if (delivery.admin.status !== "sent") {
    throw new Error(delivery.admin.error ?? "Failed to email the admin.");
  }

  return delivery;
}

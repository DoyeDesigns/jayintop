import type { ResumeContact, ResumeContent, ResumeEntry } from "@/lib/admin-content";

const sectionTitle =
  "text-left font-tanker md:text-[48px] text-[30px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase";

const entryTitle =
  "text-left font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-brand-white md:font-tanker md:text-[24px] md:leading-[1.2]";

const bodyText =
  "text-left font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-[#D5D2CC]";

const dateText =
  "text-left font-bespoke text-[18px] leading-[1.5] font-medium tracking-normal text-[#8C8A87]";

function hasEntry(entry: ResumeEntry) {
  return Boolean(entry.title.trim() || entry.date.trim() || entry.paragraphs.some((paragraph) => paragraph.trim()));
}

function ContactLink({ contact }: { contact: ResumeContact }) {
  const text = contact.text.trim();
  const href = contact.href.trim();
  if (!text && !href) return null;
  const external = /^https?:/i.test(href);

  return (
    <a
      href={href || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {text || href}
    </a>
  );
}

export function Resume({ resume }: { resume: ResumeContent }) {
  const contacts = resume.contacts.filter((contact) => contact.text.trim() || contact.href.trim());

  return (
    <div className="flex w-full flex-col gap-8 md:gap-20">
      <div className="flex gap-4 flex-col items-start text-left md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-tanker md:text-[60px] text-[30px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
            {resume.name}
          </h2>
          {resume.role.trim() ? (
            <p className="font-bespoke md:text-[20px] text-[16px] leading-[1.5] font-normal tracking-normal text-[#D5D2CC]">
              {resume.role}
            </p>
          ) : null}
        </div>
        {contacts.length ? (
          <div className="flex flex-col font-bespoke text-[20px] leading-[1.5] font-normal tracking-normal text-[#8C8A87] md:text-right">
            {contacts.map((contact) => (
              <ContactLink key={`${contact.text}-${contact.href}`} contact={contact} />
            ))}
          </div>
        ) : null}
      </div>

      {resume.sections.map((section, sectionIndex) => {
        const entries = section.entries.filter(hasEntry);
        if (!section.title.trim() && !entries.length) return null;

        return (
          <section
            key={`${section.title}-${sectionIndex}`}
            className="flex flex-col items-start gap-6 text-left md:flex-row md:justify-between md:gap-16"
          >
            <h2 className={`${sectionTitle} md:max-w-[420px]`}>{section.title}</h2>
            <div className="flex w-full flex-col gap-8 md:max-w-[640px]">
              {entries.map((entry, entryIndex) => (
                <div key={`${sectionIndex}-${entryIndex}`} className="flex flex-col gap-3 text-left">
                  {entry.title.trim() ? <h3 className={entryTitle}>{entry.title}</h3> : null}
                  {entry.date.trim() ? <p className={dateText}>{entry.date}</p> : null}
                  {entry.paragraphs
                    .filter((paragraph) => paragraph.trim())
                    .map((paragraph) => (
                      <p key={paragraph} className={bodyText}>
                        {paragraph}
                      </p>
                    ))}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export const socials = [
  { name: "X", src: "/social-icons/Social%20icon.svg" },
  { name: "LinkedIn", src: "/social-icons/linkedin.svg" },
  { name: "Facebook", src: "/social-icons/facebook.svg" },
  { name: "TikTok", src: "/social-icons/tiktok.svg" },
  { name: "Instagram", src: "/social-icons/instagram.svg" },
  { name: "Dribbble", src: "/social-icons/dribble.svg" },
  { name: "WhatsApp", src: "/social-icons/whatsapp.svg" },
  { name: "Telegram", src: "/social-icons/telegram.svg" },
  { name: "Behance", src: "/social-icons/behance.svg" },
];

export function linkedSocials(links: { label: string; url: string; hidden?: boolean }[]) {
  return socials.flatMap((social) => {
    const match = links.find(
      (link) => link.label.trim().toLowerCase() === social.name.toLowerCase(),
    );
    if (match?.hidden) return [];
    const url = match?.url.trim();
    return [{ ...social, href: url || "#" }];
  });
}

export const socials = [
  { name: "X", src: "/social-icons/Social%20icon.svg" },
  { name: "LinkedIn", src: "/social-icons/linkedin.svg" },
  { name: "Facebook", src: "/social-icons/facebook.svg" },
  { name: "TikTok", src: "/social-icons/tiktok.svg" },
  { name: "Instagram", src: "/social-icons/instagram.svg" },
  { name: "Dribbble", src: "/social-icons/dribble.svg" },
  { name: "WhatsApp", src: "/social-icons/whatsapp.svg" },
];

export function linkedSocials(links: { label: string; url: string }[]) {
  return socials.map((social) => {
    const match = links.find(
      (link) =>
        link.label.trim().toLowerCase() === social.name.toLowerCase() &&
        link.url.trim(),
    );
    return { ...social, href: match?.url.trim() || "#" };
  });
}

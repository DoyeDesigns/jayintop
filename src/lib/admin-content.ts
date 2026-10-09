import { socials as iconSocials } from "@/lib/socials";

export type AdminImage = {
  src: string;
  name: string;
  w: number;
  h: number;
};

export type CornerProjectImage = "desktop" | "mobile" | "marquee";

export type HomeCorner = {
  title: string;
  brand: string;
  tag: string;
  href: string;
  image: AdminImage | null;
  /** Optional link to a case study for quick fill in admin. */
  projectId: string;
  projectImage: CornerProjectImage | "";
};

export type Service = {
  title: string;
  copy: string;
  image: AdminImage | null;
  /** Four floating cards for this category tab (top-left, top-right, bottom-left, bottom-right). */
  corners: HomeCorner[];
};

export type AboutSection = {
  title: string;
  body: string;
  media: AdminImage | null;
};

export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  featured: boolean;
};

export type ContentBlock = {
  type: "text" | "image" | "pair" | "video" | "quote";
  heading: string;
  body: string;
  url: string;
  image: AdminImage | null;
  urlA: AdminImage | null;
  urlB: AdminImage | null;
  caption: string;
};

export type CaseStatus = "published" | "hidden" | "draft";

export type MarqueeSource = "desktop" | "mobile" | "custom";

export type WorkFilterItem = {
  label: string;
  hidden: boolean;
  all?: boolean;
};

export type CaseItem = {
  id: string;
  title: string;
  client: string;
  role: string;
  categories: string[];
  year: string;
  status: CaseStatus;
  cover: AdminImage | null;
  coverMobile: AdminImage | null;
  showOnHome: boolean;
  marqueeSource: MarqueeSource;
  marqueeCover: AdminImage | null;
  summary: string;
  blocks: ContentBlock[];
};

export type SocialLink = {
  label: string;
  url: string;
  hidden?: boolean;
};

export type ResumeContact = {
  text: string;
  href: string;
};

export type ResumeEntry = {
  title: string;
  date: string;
  paragraphs: string[];
};

export type ResumeSection = {
  title: string;
  entries: ResumeEntry[];
};

export type ResumeContent = {
  title: string;
  name: string;
  role: string;
  contacts: ResumeContact[];
  sections: ResumeSection[];
};

export type AdminContent = {
  site: {
    name: string;
    tagline: string;
    email: string;
    metaTitle: string;
    metaDesc: string;
    socials: SocialLink[];
  };
  home: {
    heroName: string;
    heroHeadline: string;
    heroHighlight: string;
    heroLeft: string;
    heroRight: string;
    heroCta: string;
    beliefEyebrow: string;
    beliefLead: string;
    beliefBody: string;
    services: Service[];
    video: {
      poster: AdminImage | null;
      src: string;
      label: string;
    };
  };
  about: {
    eyebrow: string;
    headline: string;
    highlight: string;
    sub: string;
    sections: AboutSection[];
    bits: string[];
    closeLine: string;
    closeCta: string;
  };
  work: {
    title: string;
    subtitle: string;
    filters: WorkFilterItem[];
  };
  contact: {
    headline: string;
    body: string;
    cta: string;
  };
  resume: ResumeContent;
  testimonials: TestimonialItem[];
  cases: CaseItem[];
};

export function emptyBlock(type: ContentBlock["type"]): ContentBlock {
  return {
    type,
    heading: "",
    body: "",
    url: "",
    image: null,
    urlA: null,
    urlB: null,
    caption: "",
  };
}

export function createId() {
  return `c${Math.random().toString(36).slice(2, 8)}`;
}

function defaultResume(): ResumeContent {
  return {
    title: "My resume",
    name: "Yinka Jayeola",
    role: "UI/UX Designer",
    contacts: [
      { text: "yinka@jayintop.com", href: "mailto:yinka@jayintop.com" },
      { text: "linkedin.com/in/jayintop", href: "https://linkedin.com/in/jayintop" },
      { text: "+2348137645364", href: "tel:+2348137645364" },
    ],
    sections: [
      {
        title: "Bio",
        entries: [
          {
            title: "",
            date: "",
            paragraphs: [
              "Dynamic Senior Product Designer with 6+ years of experience delivering user-centred enterprise solutions in fintech, govtech, healthtech, and e-commerce for clients across the UK, USA, Australia, and Nigeria. Expert in end-to-end product design (100–1,600+ screen scopes), design systems, marketplace/payment flows, and brand identity. Founder of Jayintop Studio, a productized design agency focused on scalable UI/UX and branding services that drive conversion improvements (e.g., 35%+ uplift) and support multi-million USD operations. Passionate about human-centred design that creates seamless, profitable experiences. Open to senior/lead roles in innovative global teams.",
            ],
          },
        ],
      },
      {
        title: "Education",
        entries: [
          {
            title: "OBAFEMI AWOLOWO UNIVERSITY",
            date: "2013 – 2020",
            paragraphs: ["Bsc. Chemical Engineering"],
          },
        ],
      },
      {
        title: "Experience",
        entries: [
          {
            title: "FOUNDER & CREATIVE DIRECTOR, JAYINTOP STUDIO",
            date: "01/2025 – Present · Nigeria (Remote Global)",
            paragraphs: [
              "Founded and scaled a productized design agency offering streamlined services in brand identity, UI/UX audits, website design, social media kits, marketing collateral, and full product development.",
              "Delivered 25+ projects for international startups and enterprises, including enterprise dashboards and brand systems, fostering repeat business and portfolio growth in fintech/e-commerce.",
              "Led end-to-end strategy, operations, and client delivery, emphasizing agile workflows and accessibility (WCAG AA) to enhance user engagement and business outcomes.",
            ],
          },
          {
            title: "Senior Product Design Lead (Contract), FixMyBuild (UK)",
            date: "01/2022 – 12/2023 · UK (Remote)",
            paragraphs: [
              "Sole designer for a two-sided home-services marketplace; shipped v1.0 (120+ screens) from pre-seed to 10k+ downloads.",
              "Owned onboarding, quote engine, real-time chat, Stripe escrow payments, and trust/safety features; drove 35% faster quote-to-booking conversion via 60+ user interviews and usability testing.",
            ],
          },
          {
            title: "Senior Product & Brand Identity Designer, Upwork, PeoplePerHour & Fiverr",
            date: "01/2021 – Present · Global (Remote)",
            paragraphs: [
              "Top 0.1% rated across platforms; executed $15k–$80k contracts in brand identity, SaaS redesigns, and fintech dashboards for UK/US/EU clients.",
              "Shipped 200+ projects, including luxury branding and e-commerce platforms, earning 5-star reviews for strategic depth, rapid iteration, and client-focused outcomes.",
            ],
          },
          {
            title: "SENIOR DESIGN LEAD (CONTRACT), FROSTFLOW FOODS",
            date: "01/2025 – Present · Nigeria (Remote Global)",
            paragraphs: [
              "Leading design of a three-sided frozen-food e-commerce ecosystem (consumer, wholesale, retailer portals), owning unified design system, subscription flows, bulk ordering, and checkout optimization across web/mobile.",
              "Collaborated with UK founders on remote sprints, conducting UX research to ensure WCAG AA compatibility, mobile responsiveness, and 25%+ conversion uplift in high-order-value experiences.",
            ],
          },
          {
            title: "Senior Product Designer / Design Lead, ThoughtCab Design Agency",
            date: "12/2021 – 12/2024 · United State (Remote)",
            paragraphs: [
              "Led UI/UX for high-growth startups in fintech, healthtech, and edtech; owned 100–400+ screen scopes, mentoring 12+ juniors and delivering Root Diamonds, Coral Health, and Root Ally platforms.",
              "Ensured seamless developer handoff, accessibility compliance, and iterative improvements based on analytics, contributing to live deployments with enhanced user retention.",
            ],
          },
          {
            title: "DESIGN LEAD, THOUGHTCAB DESIGN AGENCY",
            date: "12/2021 – 12/2024 · United State (Remote)",
            paragraphs: [
              "Led UI/UX for high-growth startups in fintech, healthtech, and edtech; owned 100–400+ screen scopes, mentoring 12+ juniors and delivering Root Diamonds, Coral Health, and Root Ally platforms.",
              "Ensured seamless developer handoff, accessibility compliance, and iterative improvements based on analytics, contributing to live deployments with enhanced user retention.",
            ],
          },
        ],
      },
      {
        title: "Skill",
        entries: [
          {
            title: "RESEARCH",
            date: "",
            paragraphs: [
              "User Research · Journey Mapping · Heuristic Evaluations · Accessibility Audits (WCAG 2.2+) · Information Architecture · Usability Testing",
            ],
          },
          {
            title: "CORE DESIGN",
            date: "",
            paragraphs: [
              "Product Design · UI/UX Design · Design Systems · Interaction Design · Brand Identity · Creative Direction",
            ],
          },
          {
            title: "UI/UX TOOLS",
            date: "",
            paragraphs: [
              "Figma (Expert) · Framer · Adobe Suite · After Effects · Miro · FigJam · Webflow · Penpot · Notion · Jira",
            ],
          },
          {
            title: "SOFT SKILLS",
            date: "",
            paragraphs: [
              "· Critical Thinker · Analytical Reasoning · Remote Leadership · Attention to Detail · Receptive to Feedback · Problem Solver · Excellent Written Communication · Consistent & Honest Judgment · Empathetic",
            ],
          },
        ],
      },
      {
        title: "Certificates & training",
        entries: [
          { title: "GOOGLE UX DESIGN CERTIFICATE", date: "12/01/2025", paragraphs: [] },
          { title: "MASTER DIGITAL PRODUCT DESIGN, UDEMY", date: "12/01/2025", paragraphs: [] },
          { title: "ULTIMATE FIGMA MASTERCLASS, DESIGNERSHIP", date: "12/01/2025", paragraphs: [] },
          { title: "FOUNDATIONS OF UX DESIGN, COURSERA", date: "12/01/2025", paragraphs: [] },
          { title: "MASTER DIGITAL PRODUCT DESIGN, UDEMY", date: "12/01/2025", paragraphs: [] },
          { title: "PROMPT ENGINEERING FOR EVERYONE, COURSERA", date: "12/01/2025", paragraphs: [] },
          { title: "TECHNICAL WRITING FUNDAMENTALS, GOOGLE", date: "12/01/2025", paragraphs: [] },
          { title: "AI FOR EVERYONE, ANDREW NG / COURSERA", date: "12/01/2025", paragraphs: [] },
          { title: "ENGLISH", date: "", paragraphs: ["Native/Bilingual"] },
          { title: "YORUBA", date: "", paragraphs: ["Native/Bilingual"] },
        ],
      },
    ],
  };
}

export function defaultContent(): AdminContent {
  return {
    site: {
      name: "Yinka T. Jayeola",
      tagline: "Brand identity and product UI/UX design",
      email: "",
      metaTitle: "Yinka T. Jayeola, Brand Identity and Product UI/UX Designer",
      metaDesc:
        "Brand identity and product UI/UX design for startups in fintech, healthtech and edtech.",
      socials: [
        { label: "Instagram", url: "", hidden: false },
        { label: "X", url: "", hidden: false },
        { label: "LinkedIn", url: "", hidden: false },
        { label: "Dribbble", url: "", hidden: false },
        { label: "WhatsApp", url: "", hidden: false },
        { label: "Telegram", url: "", hidden: false },
        { label: "Behance", url: "", hidden: false },
      ],
    },
    home: {
      heroName: "Yinka T. Jayeola",
      heroHeadline: "Design that works as well as it looks.",
      heroHighlight: "works",
      heroLeft:
        "Brand identity and product UI/UX design for startups in fintech, healthtech and edtech. I take an identity from the first brief to a finished system, and a product from the first idea to a shipped release.",
      heroRight:
        "Every project runs the same four steps: discovery, brief, creation, delivery. Nothing gets designed until we both agree in writing what it needs to achieve.",
      heroCta: "See my work",
      beliefEyebrow: "What I believe",
      beliefLead: "Good design has a job to do.",
      beliefBody:
        "A logo that only looks right on a clean white background is not finished. A screen that looks great and loses customers is not finished either. If it looks good and does not work, it is decoration, and decoration is easy to find.\n\nSo I start with the problem, not the picture. Who uses this. What stops them. What counts as success. We agree on the answers first, then I design, then we check the result against what we agreed.",
      services: [
        {
          title: "All case studies",
          copy: "A few projects taken from the first sketch through to a finished system. Open one to see how it was built.",
          image: null,
          corners: emptyCorners(),
        },
        {
          title: "Logo and brand design",
          copy: "Your brand looks smaller than the work you actually do. I fix that with a logo, colours, type and clear rules for using them.",
          image: null,
          corners: emptyCorners(),
        },
        {
          title: "Product UI/UX",
          copy: "People are dropping out of your product and nobody can say exactly where. I find out, redesign the screens that lose them, and give your developers files they can build from.",
          image: null,
          corners: emptyCorners(),
        },
        {
          title: "Packaging",
          copy: "The brand looks sharp on the website and falls apart in the pitch deck, the packaging and the feed. I extend it everywhere else you show up.",
          image: null,
          corners: emptyCorners(),
        },
      ],
      video: {
        poster: { src: "/magic.png", name: "magic.png", w: 1600, h: 900 },
        src: "",
        label: "Play",
      },
    },
    about: {
      eyebrow: "About me",
      headline:
        "I make brands look like the real thing, and products simple to use.",
      highlight: "simple to use",
      sub: "I am Yinka T. Jayeola, a brand identity and product UI/UX designer. Most people know me as Jayintop.",
      sections: [
        {
          title: "The work",
          body: "I do two things, and only two, because I would rather be excellent at a pair of them than average at ten.\n\n**Brand identity.** A logo, a colour and type system, and clear rules for using them. Built to hold up on a small label and on a shop front, and simple enough that your team can apply it without calling me.\n\n**Product design.** The screens people actually use. Sign up, checkout, payments, messaging and the design system behind them. Mostly for startups in fintech, healthtech and edtech, where a confusing screen costs real money.",
          media: null,
        },
        {
          title: "The reason",
          body: "Most design fails quietly. The logo only works on a clean background. The screen looks lovely and loses customers. Nobody calls it a failure. It just never earns anything back.\n\nI would rather make the other kind. Work that carries your idea and still does its job once real people get their hands on it. That is the whole standard, and I hold every project to it.\n\nThe longer aim is bigger than any single job. I want to build a practice worth respecting in this industry, and to give something useful back to other designers along the way.",
          media: null,
        },
        {
          title: "The way I work",
          body: "Four steps, every time. **Discovery, brief, creation, delivery.** Nothing gets designed until we have both agreed in writing what it needs to achieve.\n\nResearch comes before drawing. I have run more than sixty user interviews on a single project just to check a direction was worth building. I write decisions down instead of defending them in a meeting, and I show progress at agreed points rather than saving one big reveal for the end.\n\nDelivery means what it says. Files named and organised, accessibility handled from the first screen, and a handover your developers can build from without a follow up call.",
          media: null,
        },
      ],
      bits: [
        "I draw every logo by hand first. The good ones survive the paper.",
        "I have mentored twelve junior designers, and I still take notes when other people review work.",
        "Accessibility is in my files from day one, not added at the end.",
        "I play chess. It is where I learned to read the whole board before moving.",
        "I would rather you tell me the truth about a design than be polite about it.",
      ],
      closeLine: "For people who want the work to actually work.",
      closeCta: "See what I have made",
    },
    work: {
      title: "Selected work",
      subtitle:
        "A few projects taken from the first sketch through to a finished system. Open one to see how it was built.",
      filters: [
        { label: "All", hidden: false, all: true },
        { label: "All case studies", hidden: false },
        { label: "Logo and brand design", hidden: false },
        { label: "Product UI/UX", hidden: false },
        { label: "Packaging", hidden: false },
      ],
    },
    contact: {
      headline: "Tell me what you are building",
      body: "Send a short note about the project and what it needs to achieve. If I am not the right person for it, I will say so and point you somewhere better.",
      cta: "Start a project",
    },
    resume: defaultResume(),
    testimonials: [
      {
        quote:
          "He served as our sole design partner from pre-seed through launch, delivering over 120 screens. Quote to booking conversion improved by 35%. Version 1.0 reached 10,000 downloads.",
        name: "Nikolas Gibbons",
        role: "Founder, FixMyBuild",
        featured: true,
      },
      {
        quote:
          "He is patient, and because of that he produces exactly what I need at high quality. The logo work is professional and I will be using him again.",
        name: "Brett Henry Murphy",
        role: "Product Manager",
        featured: true,
      },
      {
        quote:
          "I came to him with a completely different task, but he suggested changing my logo first. The new one beat my original more than ten times over.",
        name: "Design Magic",
        role: "Powersurge",
        featured: true,
      },
      {
        quote:
          "Excellent service, delivered two days earlier than expected. Constant communication throughout the entire process.",
        name: "Samirmatin",
        role: "Powersurge",
        featured: false,
      },
    ],
    cases: [],
  };
}

export function getAt(source: unknown, path: string) {
  return path.split(".").reduce<unknown>((value, key) => {
    if (value == null || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[key];
  }, source);
}

export function setAt<T>(source: T, path: string, value: unknown): T {
  const next = structuredClone(source);
  const keys = path.split(".");
  let cursor: Record<string, unknown> = next as Record<string, unknown>;

  for (let index = 0; index < keys.length - 1; index += 1) {
    cursor = cursor[keys[index]] as Record<string, unknown>;
  }

  cursor[keys[keys.length - 1]] = value as never;
  return next;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function mergeContent(base: AdminContent, saved: unknown): AdminContent {
  if (!isRecord(saved)) return base;

  const mergeValue = (fallback: unknown, incoming: unknown): unknown => {
    if (Array.isArray(fallback)) return Array.isArray(incoming) ? incoming : fallback;
    if (isRecord(fallback)) {
      const next = { ...fallback };
      const source = isRecord(incoming) ? incoming : {};
      for (const key of Object.keys(fallback)) {
        next[key] = mergeValue(fallback[key], source[key]);
      }
      return next;
    }
    return incoming === undefined ? fallback : incoming;
  };

  const merged = mergeValue(base, saved) as AdminContent;
  const filters = normalizeFilters(merged.work.filters);
  const home = normalizeHome(merged.home);
  return {
    ...merged,
    cases: merged.cases.map(normalizeCase),
    about: normalizeAbout(merged.about),
    home: {
      ...home,
      services: syncServicesToFilters(home.services, filters),
    },
    work: { ...merged.work, filters },
    resume: normalizeResume(merged.resume ?? defaultResume()),
    site: { ...merged.site, socials: withIconSocials(merged.site.socials) },
  };
}

function emptyCorner(): HomeCorner {
  return {
    title: "",
    brand: "",
    tag: "",
    href: "",
    image: null,
    projectId: "",
    projectImage: "",
  };
}

function emptyCorners(): HomeCorner[] {
  return [emptyCorner(), emptyCorner(), emptyCorner(), emptyCorner()];
}

function normalizeProjectImage(value: unknown): CornerProjectImage | "" {
  return value === "desktop" || value === "mobile" || value === "marquee" ? value : "";
}

function normalizeCorners(raw: unknown, fallback?: HomeCorner[]): HomeCorner[] {
  const source = Array.isArray(raw) ? raw : Array.isArray(fallback) ? fallback : [];
  const next = source.slice(0, 4).map((item) => {
    const row = item as Partial<HomeCorner> | null | undefined;
    return {
      title: typeof row?.title === "string" ? row.title : "",
      brand: typeof row?.brand === "string" ? row.brand : "",
      tag: typeof row?.tag === "string" ? row.tag : "",
      href: typeof row?.href === "string" ? row.href : "",
      image: asImage(row?.image),
      projectId: typeof row?.projectId === "string" ? row.projectId : "",
      projectImage: normalizeProjectImage(row?.projectImage),
    };
  });
  while (next.length < 4) next.push(emptyCorner());
  return next;
}

export function projectCornerImage(
  project: CaseItem,
  kind: CornerProjectImage,
): AdminImage | null {
  if (kind === "desktop") return project.cover;
  if (kind === "mobile") return project.coverMobile;
  return project.marqueeCover;
}

export function fillCornerFromProject(
  project: CaseItem,
  imageKind?: CornerProjectImage | "",
): HomeCorner {
  const available: CornerProjectImage[] = [];
  if (project.cover) available.push("desktop");
  if (project.coverMobile) available.push("mobile");
  if (project.marqueeCover) available.push("marquee");
  const kind =
    imageKind && available.includes(imageKind) ? imageKind : available[0] || "";

  return {
    title: project.title,
    brand: project.client.trim() || project.role.trim() || "",
    tag: project.categories.find((entry) => entry.trim()) || "",
    href: `/selected-work/${project.id}`,
    image: kind ? projectCornerImage(project, kind) : null,
    projectId: project.id,
    projectImage: kind,
  };
}

/** What I do categories share Work filters (everything except All). */
export function syncServicesToFilters(
  services: Service[],
  filters: WorkFilterItem[],
): Service[] {
  const byTitle = new Map(
    (Array.isArray(services) ? services : []).map(
      (item) => [item.title.trim().toLowerCase(), item] as const,
    ),
  );
  return filters
    .filter((item) => !item.all)
    .map((item) => {
      const existing = byTitle.get(item.label.trim().toLowerCase());
      return {
        title: item.label,
        copy: existing?.copy ?? "",
        image: existing?.image ?? null,
        corners: normalizeCorners(existing?.corners),
      };
    });
}

export function categoryFilterEntries(filters: WorkFilterItem[]) {
  return filters
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !item.all);
}

function normalizeHome(home: AdminContent["home"]): AdminContent["home"] {
  const services = Array.isArray(home?.services) ? home.services : [];
  // Older saves kept one shared corner set on home; seed each category once.
  const legacyCorners = normalizeCorners(
    (home as AdminContent["home"] & { corners?: HomeCorner[] }).corners,
  );
  const hasLegacy = legacyCorners.some((item) => item.image?.src || item.title.trim());

  return {
    ...home,
    services: services.map((item) => {
      const rawCorners = (item as Service)?.corners;
      const useLegacy = !Array.isArray(rawCorners) && hasLegacy;
      return {
        title: typeof item?.title === "string" ? item.title : "",
        copy: typeof item?.copy === "string" ? item.copy : "",
        image: asImage((item as Service)?.image),
        corners: normalizeCorners(rawCorners, useLegacy ? legacyCorners : undefined),
      };
    }),
    video: {
      poster: asImage(home?.video?.poster),
      src: typeof home?.video?.src === "string" ? home.video.src : "",
      label: typeof home?.video?.label === "string" && home.video.label.trim()
        ? home.video.label
        : "Play",
    },
  };
}

export function visibleFilterLabels(filters: WorkFilterItem[]) {
  return filters
    .filter((item) => !item.hidden && item.label.trim())
    .map((item) => ({ label: item.label, all: Boolean(item.all) }));
}

const starterBodies: Record<string, string> = {
  "the work":
    "I do two things, and only two, because I would rather be excellent at a pair of them than average at ten.",
  "the reason":
    "Most design fails quietly. The logo only works on a clean background. The screen looks lovely and loses customers.",
  "the way i work":
    "Four steps, every time. Discovery, brief, creation, delivery. Nothing gets designed until we have both agreed in writing what it needs to achieve.",
};

function normalizeAbout(about: AdminContent["about"]): AdminContent["about"] {
  const starters = defaultContent().about.sections;
  return {
    ...about,
    sections: about.sections.map((section) => {
      const key = section.title.trim().toLowerCase();
      const starter = starters.find((item) => item.title.trim().toLowerCase() === key);
      if (starter && section.body.trim() === starterBodies[key]) return { ...section, body: starter.body };
      return section;
    }),
  };
}

function withIconSocials(links: SocialLink[]) {
  const next = Array.isArray(links) ? links.map((link) => ({ ...link })) : [];
  for (const social of iconSocials) {
    const found = next.some((link) => link.label.trim().toLowerCase() === social.name.toLowerCase());
    if (!found) next.push({ label: social.name, url: "", hidden: false });
  }
  return next;
}

function asText(value: unknown) {
  return typeof value === "string" ? value : "";
}

function normalizeResume(resume: ResumeContent): ResumeContent {
  const contacts = Array.isArray(resume?.contacts) ? resume.contacts : [];
  const sections = Array.isArray(resume?.sections) ? resume.sections : [];

  return {
    title: asText(resume?.title),
    name: asText(resume?.name),
    role: asText(resume?.role),
    contacts: contacts.map((item) => ({
      text: asText(item?.text),
      href: asText(item?.href),
    })),
    sections: sections.map((section) => ({
      title: asText(section?.title),
      entries: (Array.isArray(section?.entries) ? section.entries : []).map((entry) => ({
        title: asText(entry?.title),
        date: asText(entry?.date),
        paragraphs: (Array.isArray(entry?.paragraphs) ? entry.paragraphs : []).filter(
          (paragraph): paragraph is string => typeof paragraph === "string",
        ),
      })),
    })),
  };
}

function normalizeFilters(filters: unknown): WorkFilterItem[] {
  const items = Array.isArray(filters)
    ? filters.map((item) => {
        if (typeof item === "string") return { label: item, hidden: false };
        if (item && typeof item === "object") {
          const record = item as { label?: unknown; hidden?: unknown; all?: unknown };
          return {
            label: typeof record.label === "string" ? record.label : "",
            hidden: Boolean(record.hidden),
            all: Boolean(record.all),
          };
        }
        return { label: "", hidden: false };
      })
    : [];
  if (!items.some((item) => item.all)) {
    items.unshift({ label: "All", hidden: false, all: true });
  }
  return items;
}

function asImage(value: unknown): AdminImage | null {
  if (!value || typeof value !== "object") return null;
  const record = value as { src?: unknown; name?: unknown; w?: unknown; h?: unknown };
  if (typeof record.src !== "string" || !record.src) return null;
  return {
    src: record.src,
    name: typeof record.name === "string" ? record.name : "",
    w: typeof record.w === "number" ? record.w : 0,
    h: typeof record.h === "number" ? record.h : 0,
  };
}

function normalizeCase(item: CaseItem): CaseItem {
  const raw = item as CaseItem & {
    category?: unknown;
    categories?: unknown;
    coverMobile?: unknown;
    showOnHome?: unknown;
    marqueeSource?: unknown;
    marqueeCover?: unknown;
  };
  const listed = Array.isArray(raw.categories) ? raw.categories : [];
  const previous =
    typeof raw.category === "string"
      ? raw.category.split(",")
      : Array.isArray(raw.category)
        ? raw.category
        : [];
  const categories = [...listed, ...previous]
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean)
    .filter(
      (value, index, list) =>
        list.findIndex((other) => other.toLowerCase() === value.toLowerCase()) === index,
    );

  return {
    id: item.id,
    title: item.title,
    client: item.client,
    role: item.role,
    categories,
    year: item.year,
    status: item.status,
    cover: asImage(item.cover),
    coverMobile: asImage(raw.coverMobile),
    showOnHome: typeof raw.showOnHome === "boolean" ? raw.showOnHome : true,
    marqueeSource:
      raw.marqueeSource === "mobile" || raw.marqueeSource === "custom" ? raw.marqueeSource : "desktop",
    marqueeCover: asImage(raw.marqueeCover),
    summary: item.summary,
    blocks: item.blocks,
  };
}

export function readImageFile(file: File): Promise<AdminImage> {
  const name = file.name.replace(/\.[^.]+$/, "");

  return new Promise((resolve, reject) => {
    if (file.size > 9 * 1024 * 1024) {
      reject(new Error("That image is too large. The limit is 9 MB."));
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("That is not an image file."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("That image could not be read."));
    reader.onload = () => {
      const result = String(reader.result);

      if (file.type === "image/svg+xml") {
        resolve({ src: result, name, w: 0, h: 0 });
        return;
      }

      const image = new Image();
      image.onerror = () => reject(new Error("That image could not be read."));
      image.onload = () => {
        const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
        const w = Math.round(image.width * scale);
        const h = Math.round(image.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("That image could not be read."));
          return;
        }
        context.drawImage(image, 0, 0, w, h);
        const src =
          file.type === "image/png"
            ? canvas.toDataURL("image/png")
            : canvas.toDataURL("image/jpeg", 0.84);
        resolve({ src, name, w, h });
      };
      image.src = result;
    };
    reader.readAsDataURL(file);
  });
}

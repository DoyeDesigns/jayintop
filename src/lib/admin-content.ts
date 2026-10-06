export type AdminImage = {
  src: string;
  name: string;
  w: number;
  h: number;
};

export type Service = {
  title: string;
  copy: string;
};

export type AboutSection = {
  title: string;
  body: string;
  media: AdminImage | null;
};

export type Receipt = {
  value: string;
  label: string;
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

export type WorkFilterItem = {
  label: string;
  hidden: boolean;
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
  summary: string;
  blocks: ContentBlock[];
};

export type SocialLink = {
  label: string;
  url: string;
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
  };
  about: {
    eyebrow: string;
    headline: string;
    highlight: string;
    sub: string;
    sections: AboutSection[];
    bits: string[];
    receipts: Receipt[];
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
        { label: "Instagram", url: "" },
        { label: "X", url: "" },
        { label: "LinkedIn", url: "" },
        { label: "Dribbble", url: "" },
        { label: "WhatsApp", url: "" },
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
          title: "Brand identity",
          copy: "Your brand looks smaller than the work you actually do. I fix that with a logo, colours, type and clear rules for using them.",
        },
        {
          title: "Product design",
          copy: "People are dropping out of your product and nobody can say exactly where. I find out, redesign the screens that lose them, and give your developers files they can build from.",
        },
        {
          title: "Website design",
          copy: "Your website looks like everyone else in your market. I plan it, design it, and make sure it works as well on a phone as on a laptop.",
        },
        {
          title: "Design systems",
          copy: "Your product looks slightly different on every screen. I build reusable parts and simple rules so it stays consistent as your team grows.",
        },
        {
          title: "Social and print",
          copy: "The brand looks sharp on the website and falls apart in the pitch deck, the packaging and the feed. I extend it everywhere else you show up.",
        },
      ],
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
          body: "I do two things, and only two, because I would rather be excellent at a pair of them than average at ten.",
          media: null,
        },
        {
          title: "The reason",
          body: "Most design fails quietly. The logo only works on a clean background. The screen looks lovely and loses customers.",
          media: null,
        },
        {
          title: "The way I work",
          body: "Four steps, every time. Discovery, brief, creation, delivery. Nothing gets designed until we have both agreed in writing what it needs to achieve.",
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
      receipts: [
        { value: "400+", label: "Screens designed" },
        { value: "60+", label: "User interviews" },
        { value: "10k", label: "Downloads on a v1.0" },
        { value: "35%", label: "More bookings" },
      ],
      closeLine: "For people who want the work to actually work.",
      closeCta: "See what I have made",
    },
    work: {
      title: "Selected work",
      subtitle:
        "A few projects taken from the first sketch through to a finished system. Open one to see how it was built.",
      filters: [
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
  return {
    ...merged,
    cases: merged.cases.map(normalizeCase),
    work: { ...merged.work, filters: normalizeFilters(merged.work.filters) },
    resume: normalizeResume(merged.resume ?? defaultResume()),
  };
}

export function visibleFilterLabels(filters: WorkFilterItem[]) {
  return filters
    .filter((item, index) => (index === 0 || !item.hidden) && item.label.trim())
    .map((item) => item.label);
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
  if (!Array.isArray(filters)) return [];
  return filters.map((item) => {
    if (typeof item === "string") return { label: item, hidden: false };
    if (item && typeof item === "object") {
      const record = item as { label?: unknown; hidden?: unknown };
      return {
        label: typeof record.label === "string" ? record.label : "",
        hidden: Boolean(record.hidden),
      };
    }
    return { label: "", hidden: false };
  });
}

function normalizeCase(item: CaseItem): CaseItem {
  const raw = item as CaseItem & { category?: unknown; categories?: unknown };
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
    cover: item.cover,
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

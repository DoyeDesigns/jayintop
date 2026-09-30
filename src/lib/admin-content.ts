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

export type CaseItem = {
  id: string;
  title: string;
  client: string;
  role: string;
  category: string;
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
    filters: string[];
  };
  contact: {
    headline: string;
    body: string;
    cta: string;
  };
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
        "All case studies",
        "Logo and brand design",
        "Product UI/UX",
        "Packaging",
      ],
    },
    contact: {
      headline: "Tell me what you are building",
      body: "Send a short note about the project and what it needs to achieve. If I am not the right person for it, I will say so and point you somewhere better.",
      cta: "Start a project",
    },
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
    cases: [
      {
        id: "c1",
        title: "Magic",
        client: "Quality Steel and Plastic",
        role: "Identity design, art direction",
        category: "Brand Identity",
        year: "2025",
        status: "published",
        cover: null,
        summary:
          "A name that promised something fun, and materials that promised nothing at all.",
        blocks: [
          {
            type: "text",
            heading: "Discovery",
            body: "We started with a working session with the founders and a look at how everyone else in the category presents themselves.",
            url: "",
            image: null,
            urlA: null,
            urlB: null,
            caption: "",
          },
          {
            type: "pair",
            heading: "",
            body: "",
            url: "",
            image: null,
            urlA: null,
            urlB: null,
            caption: "Early brush passes",
          },
          {
            type: "text",
            heading: "The design",
            body: "The wordmark was drawn by hand long before it went near a computer.",
            url: "",
            image: null,
            urlA: null,
            urlB: null,
            caption: "",
          },
          {
            type: "video",
            heading: "",
            body: "",
            url: "",
            image: null,
            urlA: null,
            urlB: null,
            caption: "Logo animation test",
          },
        ],
      },
      {
        id: "c2",
        title: "Frostflow",
        client: "The Royal George",
        role: "Identity, web design",
        category: "Brand Identity, Web UI/UX",
        year: "2025",
        status: "published",
        cover: null,
        summary: "Hospitality identity and booking site.",
        blocks: [],
      },
      {
        id: "c3",
        title: "Gatewayshield",
        client: "Krezi",
        role: "Identity, product UI",
        category: "Brand Identity, Web UI/UX",
        year: "2024",
        status: "published",
        cover: null,
        summary: "Wayfinding and product interface.",
        blocks: [],
      },
      {
        id: "c4",
        title: "Lyflo",
        client: "Studio Eshi",
        role: "Identity, packaging",
        category: "Brand Identity, Packaging",
        year: "2024",
        status: "hidden",
        cover: null,
        summary: "Protein water range, not yet cleared for publishing.",
        blocks: [],
      },
    ],
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

  return mergeValue(base, saved) as AdminContent;
}

export function readImageFile(file: File): Promise<AdminImage> {
  const name = file.name.replace(/\.[^.]+$/, "");

  return new Promise((resolve, reject) => {
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

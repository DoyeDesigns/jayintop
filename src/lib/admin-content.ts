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

export type CaseCredit = {
  role: string;
  name: string;
};

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
  credits: CaseCredit[];
  categories: string[];
  year: string;
  liveUrl: string;
  liveHidden: boolean;
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
    heroImage: AdminImage | null;
    beliefEyebrow: string;
    beliefLead: string;
    beliefBody: string;
    beliefImage: AdminImage | null;
    services: Service[];
    video: {
      poster: AdminImage | null;
      src: string;
      label: string;
      hidden: boolean;
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
    title: "",
    name: "",
    role: "",
    contacts: [],
    sections: [],
  };
}

export function defaultContent(): AdminContent {
  return {
    site: {
      name: "",
      tagline: "",
      email: "",
      metaTitle: "",
      metaDesc: "",
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
      heroName: "",
      heroHeadline: "",
      heroHighlight: "",
      heroLeft: "",
      heroRight: "",
      heroCta: "",
      heroImage: null,
      beliefEyebrow: "",
      beliefLead: "",
      beliefBody: "",
      beliefImage: null,
      services: [],
      video: {
        poster: null,
        src: "",
        label: "Play",
        hidden: false,
      },
    },
    about: {
      eyebrow: "",
      headline: "",
      highlight: "",
      sub: "",
      sections: [],
      bits: [],
      closeLine: "",
      closeCta: "",
    },
    work: {
      title: "",
      subtitle: "",
      filters: [{ label: "All", hidden: false, all: true }],
    },
    contact: {
      headline: "",
      body: "",
      cta: "",
    },
    resume: defaultResume(),
    testimonials: [],
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
    cases: merged.cases.map((item) => normalizeCase(item, filters)),
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

  const creditName =
    project.credits.find((credit) => credit.name.trim())?.name.trim() ?? "";

  return {
    title: project.title,
    brand: project.client.trim() || creditName || project.role.trim() || "",
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
        title: item.label.trim(),
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

function filterKey(label: string) {
  return label.trim().toLowerCase();
}

export function caseMatchesFilter(item: { categories: string[] }, label: string) {
  const target = filterKey(label);
  if (!target) return false;
  return item.categories.some((entry) => filterKey(entry) === target);
}

function ensureAllFilter(filters: WorkFilterItem[]) {
  if (!filters.some((item) => item.all)) {
    filters.unshift({ label: "All", hidden: false, all: true });
  }
}

function uniqueFilterLabel(draft: AdminContent, base: string) {
  const root = base.trim() || "New category";
  let label = root;
  let n = 2;
  while (
    draft.work.filters.some(
      (entry) => !entry.all && filterKey(entry.label) === filterKey(label),
    )
  ) {
    label = `${root} ${n}`;
    n += 1;
  }
  return label;
}

/**
 * Single write path for Work filters / project categories.
 * Used by case editor, work editor, and home What I do.
 */
export function upsertWorkFilter(draft: AdminContent, rawName: string): string | null {
  const name = rawName.trim();
  if (!name) return null;

  ensureAllFilter(draft.work.filters);
  const all = draft.work.filters.find((entry) => entry.all);
  if (all && filterKey(all.label) === filterKey(name)) return null;

  const existing = draft.work.filters.find(
    (entry) => !entry.all && filterKey(entry.label) === filterKey(name),
  );
  const label = existing?.label.trim() || name;
  if (!existing) {
    draft.work.filters.push({ label, hidden: false, all: false });
  }
  draft.home.services = syncServicesToFilters(draft.home.services, draft.work.filters);
  return label;
}

/** Always creates a new filter row (unique label). */
export function createWorkFilter(draft: AdminContent, baseName = "New category"): string {
  ensureAllFilter(draft.work.filters);
  const label = uniqueFilterLabel(draft, baseName);
  draft.work.filters.push({ label, hidden: false, all: false });
  draft.home.services = syncServicesToFilters(draft.home.services, draft.work.filters);
  return label;
}

export function renameWorkFilterAt(
  draft: AdminContent,
  index: number,
  nextLabel: string,
  sessionFrom = "",
): boolean {
  const filters = draft.work.filters;
  const current = filters[index];
  if (!current) return false;

  if (current.all) {
    current.label = nextLabel.trim() || "All";
    return true;
  }

  const previous = current.label;
  const to = nextLabel.trim();
  if (to) {
    const clash = filters.find(
      (entry, i) => i !== index && !entry.all && filterKey(entry.label) === filterKey(to),
    );
    if (clash) return false;
  }

  current.label = nextLabel;

  // Keep project categories aligned while typing, even if the field was cleared
  // mid-edit (sessionFrom is the name when the input was focused).
  if (to) {
    const sources = [previous, sessionFrom]
      .map((value) => value.trim())
      .filter(Boolean);
    for (const project of draft.cases) {
      project.categories = project.categories.map((entry) =>
        sources.some((source) => filterKey(entry) === filterKey(source)) ? to : entry,
      );
    }
  }

  draft.home.services = syncServicesToFilters(draft.home.services, filters);
  return true;
}

export function removeWorkFilter(draft: AdminContent, index: number): boolean {
  const current = draft.work.filters[index];
  if (!current || current.all) return false;
  const label = filterKey(current.label);
  draft.work.filters.splice(index, 1);
  if (label) {
    for (const project of draft.cases) {
      project.categories = project.categories.filter(
        (entry) => filterKey(entry) !== label,
      );
    }
  }
  draft.home.services = syncServicesToFilters(draft.home.services, draft.work.filters);
  return true;
}

export function moveWorkFilter(
  draft: AdminContent,
  index: number,
  direction: -1 | 1,
): boolean {
  const list = draft.work.filters;
  const next = index + direction;
  if (next < 0 || next >= list.length) return false;
  if (list[index]?.all || list[next]?.all) return false;
  const [item] = list.splice(index, 1);
  list.splice(next, 0, item);
  draft.home.services = syncServicesToFilters(draft.home.services, list);
  return true;
}

export function assignCaseCategory(
  draft: AdminContent,
  caseId: string,
  rawName: string,
): boolean {
  const label = upsertWorkFilter(draft, rawName);
  if (!label) return false;
  const current = draft.cases.find((entry) => entry.id === caseId);
  if (!current) return false;
  if (!current.categories.some((entry) => filterKey(entry) === filterKey(label))) {
    current.categories.push(label);
  }
  return true;
}

export function setCaseCategories(
  draft: AdminContent,
  caseId: string,
  categories: string[],
) {
  const current = draft.cases.find((entry) => entry.id === caseId);
  if (!current) return;
  const allowed = new Map(
    draft.work.filters
      .filter((entry) => !entry.all && entry.label.trim())
      .map((entry) => [filterKey(entry.label), entry.label.trim()] as const),
  );
  current.categories = categories
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => allowed.get(filterKey(entry)) ?? entry)
    .filter(
      (entry, index, list) =>
        list.findIndex((other) => filterKey(other) === filterKey(entry)) === index,
    );
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
    heroImage: asImage(home?.heroImage),
    beliefImage: asImage(home?.beliefImage),
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
      hidden: Boolean(home?.video?.hidden),
    },
  };
}

export function visibleFilterLabels(filters: WorkFilterItem[]) {
  return filters
    .filter((item) => !item.hidden && item.label.trim())
    .map((item) => ({ label: item.label, all: Boolean(item.all) }));
}

function normalizeAbout(about: AdminContent["about"]): AdminContent["about"] {
  return {
    ...about,
    sections: about.sections.map((section) => ({ ...section })),
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
  const raw = Array.isArray(filters)
    ? filters.map((item) => {
        if (typeof item === "string") {
          return { label: item.trim(), hidden: false, all: false };
        }
        if (item && typeof item === "object") {
          const record = item as { label?: unknown; hidden?: unknown; all?: unknown };
          return {
            label: typeof record.label === "string" ? record.label.trim() : "",
            hidden: Boolean(record.hidden),
            all: Boolean(record.all),
          };
        }
        return { label: "", hidden: false, all: false };
      })
    : [];

  const items: WorkFilterItem[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (item.all) {
      if (items.some((entry) => entry.all)) continue;
      items.push({
        label: item.label.trim() || "All",
        hidden: item.hidden,
        all: true,
      });
      continue;
    }
    const key = filterKey(item.label);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    items.push({ label: item.label.trim(), hidden: item.hidden, all: false });
  }

  if (!items.some((item) => item.all)) {
    items.unshift({ label: "All", hidden: false, all: true });
  } else if (!items[0]?.all) {
    const allIndex = items.findIndex((item) => item.all);
    const [all] = items.splice(allIndex, 1);
    items.unshift(all);
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

function normalizeCredits(raw: unknown, legacyRole: unknown): CaseCredit[] {
  if (Array.isArray(raw)) {
    return raw.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const row = entry as { role?: unknown; name?: unknown };
      const role = asText(row.role).trim();
      const name = asText(row.name).trim();
      if (!role && !name) return [];
      return [{ role, name }];
    });
  }

  const legacy = asText(legacyRole).trim();
  if (!legacy) return [];
  return [{ role: legacy, name: "" }];
}

function normalizeCase(item: CaseItem, filters: WorkFilterItem[] = []): CaseItem {
  const raw = item as CaseItem & {
    category?: unknown;
    categories?: unknown;
    credits?: unknown;
    coverMobile?: unknown;
    liveUrl?: unknown;
    liveHidden?: unknown;
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
  const canonical = new Map(
    filters
      .filter((entry) => !entry.all && entry.label.trim())
      .map((entry) => [filterKey(entry.label), entry.label.trim()] as const),
  );
  const categories = [...listed, ...previous]
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => canonical.get(filterKey(value)) ?? value)
    .filter(
      (value, index, list) =>
        list.findIndex((other) => filterKey(other) === filterKey(value)) === index,
    );

  return {
    id: item.id,
    title: item.title,
    client: item.client,
    role: asText(item.role),
    credits: normalizeCredits(raw.credits, item.role),
    categories,
    year: asText(item.year),
    liveUrl: asText(raw.liveUrl),
    liveHidden: Boolean(raw.liveHidden),
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

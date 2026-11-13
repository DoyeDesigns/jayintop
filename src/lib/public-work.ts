import type { AdminContent, CaseItem, ContentBlock } from "@/lib/admin-content";
import type { WorkFilter, WorkImage, WorkItem, WorkSection } from "@/lib/work";

function imageSrc(image: CaseItem["cover"]) {
  return image?.src ?? "";
}

function marqueeSrc(item: CaseItem) {
  if (item.marqueeSource === "mobile") return imageSrc(item.coverMobile) || imageSrc(item.cover);
  if (item.marqueeSource === "custom") return imageSrc(item.marqueeCover) || imageSrc(item.cover);
  return imageSrc(item.cover);
}

function filtersFor(categories: string[]): Exclude<WorkFilter, "all">[] {
  const text = categories.join(" ").toLowerCase();
  const filters: Exclude<WorkFilter, "all">[] = [];
  if (/logo|brand|identity/.test(text)) filters.push("logo");
  if (/product|ui|ux/.test(text)) filters.push("product");
  if (/pack/.test(text)) filters.push("packaging");
  return filters;
}

function imagesFrom(block: ContentBlock): WorkImage[] {
  if (block.type === "image" && block.image?.src) {
    return [{ src: block.image.src, span: "full" }];
  }
  if (block.type === "pair") {
    return [block.urlA, block.urlB]
      .filter((image) => Boolean(image?.src))
      .map((image) => ({ src: image!.src, span: "half" as const }));
  }
  return [];
}

function sectionsFrom(item: CaseItem): WorkSection[] {
  const sections: WorkSection[] = [];
  let current: WorkSection | null = null;

  for (const block of item.blocks) {
    if (block.type === "text" || block.type === "quote") {
      if (current) sections.push(current);
      current = {
        title: block.heading || item.title,
        body: block.body || block.caption || item.summary,
        images: [],
      };
      continue;
    }

    if (block.type === "video") {
      if (!current) {
        current = {
          title: item.title,
          body: block.caption || item.summary,
          images: [],
        };
      }
      if (block.url.trim()) current.video = block.url.trim();
      if (block.urlA?.src) current.poster = block.urlA.src;
      continue;
    }

    const images = imagesFrom(block);
    if (!images.length) continue;
    if (!current) {
      current = { title: item.title, body: item.summary, images: [] };
    }
    current.images.push(...images);
  }

  if (current) sections.push(current);

  const cover = imageSrc(item.cover);

  if (sections.length === 0) {
    return [
      {
        title: item.title,
        body: item.summary,
        images: cover ? [{ src: cover, span: "full" as const }] : [],
      },
    ];
  }

  if (cover && !sections.some((section) => section.images.length)) {
    sections[0].images.push({ src: cover, span: "full" });
  }

  return sections;
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function workPath(item: Pick<WorkItem, "id" | "slug">, category?: string) {
  const path = `/selected-work/${item.slug || item.id}`;
  const cat = category?.trim();
  return cat ? `${path}?cat=${encodeURIComponent(cat)}` : path;
}

export function publishedWork(content: AdminContent): WorkItem[] {
  const used = new Set<string>();
  return content.cases
    .filter((item) => item.status === "published")
    .map((item) => {
      const base = slugify(item.title) || item.id;
      let slug = base;
      let n = 2;
      while (used.has(slug)) {
        slug = `${base}-${n}`;
        n += 1;
      }
      used.add(slug);
      return {
      id: item.id,
      slug,
      title: item.title,
      category: item.categories.join(", "),
      categories: item.categories,
      client: item.client,
      year: item.year,
      liveUrl: item.liveUrl,
      liveHidden: item.liveHidden,
      director:
        item.credits.find((credit) => credit.name.trim())?.name.trim() || item.role,
      credits: item.credits,
      filters: filtersFor(item.categories),
      image: imageSrc(item.cover),
      imageMobile: imageSrc(item.coverMobile) || imageSrc(item.cover),
      showOnHome: item.showOnHome,
      marqueeImage: marqueeSrc(item),
      sections: sectionsFrom(item),
    };
    });
}

export function homeMarqueeWork(content: AdminContent): WorkItem[] {
  return publishedWork(content)
    .filter((item) => item.showOnHome)
    .map((item) => ({ ...item, image: item.marqueeImage || item.image }));
}

export type WorkNavLink =
  | { kind: "project"; item: WorkItem; category: string }
  | { kind: "category"; label: string; href: string };

function categoryHref(label: string) {
  return `/selected-work?cat=${encodeURIComponent(label)}`;
}

export function workCategoryLabels(filters: { label: string; all?: boolean }[]) {
  return filters
    .filter((item) => !item.all && item.label.trim())
    .map((item) => item.label.trim());
}

function itemCategoryNames(item: WorkItem) {
  if (item.categories.length) return item.categories;
  if (item.category.trim()) {
    return item.category.split(",").map((entry) => entry.trim()).filter(Boolean);
  }
  return [];
}

export function resolveWorkCategory(
  item: WorkItem,
  categories: string[],
  requested?: string,
) {
  const wanted = requested?.trim().toLowerCase();
  if (wanted && matchesWorkFilter(item, requested!.trim(), false)) {
    const named = categories.find((label) => label.toLowerCase() === wanted);
    if (named) return named;
  }
  for (const name of itemCategoryNames(item)) {
    const named = categories.find((label) => label.toLowerCase() === name.toLowerCase());
    if (named) return named;
  }
  return categories[0] ?? "";
}

function wrapCategory(categories: string[], current: string, step: -1 | 1) {
  if (!categories.length) return "";
  const index = categories.findIndex((label) => label.toLowerCase() === current.toLowerCase());
  const from = index >= 0 ? index : 0;
  return categories[(from + step + categories.length) % categories.length] ?? "";
}

function projectNav(item: WorkItem, category: string): WorkNavLink {
  return { kind: "project", item, category };
}

function categoryNav(label: string): WorkNavLink {
  return { kind: "category", label, href: categoryHref(label) };
}

export function projectNeighbors(
  items: WorkItem[],
  slug: string,
  categories: string[] = [],
  requested?: string,
) {
  const index = items.findIndex((item) => item.id === slug || item.slug === slug);
  if (index < 0) return null;
  const project = items[index];
  const labels = categories.length ? categories : workCategoryLabels(
    itemCategoryNames(project).map((label) => ({ label })),
  );
  const category = resolveWorkCategory(project, labels, requested);
  const inCategory = labels.length
    ? items.filter((item) => matchesWorkFilter(item, category, false))
    : items;
  const local = inCategory.findIndex((item) => item.id === project.id);
  const count = inCategory.length;

  if (!category || count === 0 || local < 0) {
    const total = items.length;
    return {
      project,
      category,
      previous: projectNav(items[(index - 1 + total) % total], category),
      next: projectNav(items[(index + 1) % total], category),
    };
  }

  const uniqueCategories = labels.filter(
    (label, i) => labels.findIndex((other) => other.toLowerCase() === label.toLowerCase()) === i,
  );
  const wrapInPlace = uniqueCategories.length <= 1;

  const previous: WorkNavLink =
    local > 0
      ? projectNav(inCategory[local - 1], category)
      : wrapInPlace
        ? projectNav(inCategory[(local - 1 + count) % count], category)
        : categoryNav(wrapCategory(uniqueCategories, category, -1));

  const next: WorkNavLink =
    local < count - 1
      ? projectNav(inCategory[local + 1], category)
      : wrapInPlace
        ? projectNav(inCategory[(local + 1) % count], category)
        : categoryNav(wrapCategory(uniqueCategories, category, 1));

  return { project, category, previous, next };
}

export function matchesWorkFilter(item: WorkItem, label: string, isAll: boolean) {
  if (isAll) return true;
  const target = label.trim().toLowerCase();
  if (!target) return false;
  const names = item.categories.length
    ? item.categories
    : item.category
      ? [item.category]
      : [];
  return names.some((name) => name.trim().toLowerCase() === target);
}

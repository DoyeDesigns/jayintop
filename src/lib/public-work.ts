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

export function publishedWork(content: AdminContent): WorkItem[] {
  const items = content.cases
    .filter((item) => item.status === "published")
    .map((item) => ({
      id: item.id,
      title: item.title,
      category: item.categories.join(", "),
      categories: item.categories,
      client: item.client,
      director: item.role,
      filters: filtersFor(item.categories),
      image: imageSrc(item.cover),
      imageMobile: imageSrc(item.coverMobile) || imageSrc(item.cover),
      showOnHome: item.showOnHome,
      marqueeImage: marqueeSrc(item),
      sections: sectionsFrom(item),
    }));

  return items;
}

export function homeMarqueeWork(content: AdminContent): WorkItem[] {
  return publishedWork(content)
    .filter((item) => item.showOnHome)
    .map((item) => ({ ...item, image: item.marqueeImage || item.image }));
}

export function projectNeighbors(items: WorkItem[], slug: string) {
  const index = items.findIndex((item) => item.id === slug);
  if (index < 0) return null;
  const count = items.length;
  return {
    project: items[index],
    previous: items[(index - 1 + count) % count],
    next: items[(index + 1) % count],
  };
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

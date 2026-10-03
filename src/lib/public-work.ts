import type { AdminContent, CaseItem, ContentBlock } from "@/lib/admin-content";
import type { WorkFilter, WorkImage, WorkItem, WorkSection } from "@/lib/work";

function coverFor(item: CaseItem) {
  return item.cover?.src ?? "";
}

function filtersFor(category: string): Exclude<WorkFilter, "all">[] {
  const text = category.toLowerCase();
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

    const images = imagesFrom(block);
    if (!images.length) continue;
    if (!current) {
      current = { title: item.title, body: item.summary, images: [] };
    }
    current.images.push(...images);
  }

  if (current) sections.push(current);

  const cover = coverFor(item);

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
      category: item.category,
      client: item.client,
      director: item.role,
      filters: filtersFor(item.category),
      image: coverFor(item),
      sections: sectionsFrom(item),
    }));

  return items;
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
  const text = label.toLowerCase();
  const category = item.category.toLowerCase();
  if (text.includes("logo") || text.includes("brand")) {
    return item.filters.includes("logo") || /logo|brand|identity/.test(category);
  }
  if (text.includes("product") || text.includes("ui")) {
    return item.filters.includes("product") || /product|ui|ux/.test(category);
  }
  if (text.includes("pack")) {
    return item.filters.includes("packaging") || category.includes("pack");
  }
  return text
    .split(/\W+/)
    .filter((word) => word.length > 3)
    .some((word) => category.includes(word));
}

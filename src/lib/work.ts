export type WorkFilter = "all" | "logo" | "product" | "packaging";

export type WorkImage = {
  src: string;
  span: "half" | "full";
};

export type WorkSection = {
  title: string;
  body: string;
  images: WorkImage[];
};

export type WorkItem = {
  id: string;
  title: string;
  category: string;
  client: string;
  director: string;
  filters: Exclude<WorkFilter, "all">[];
  image: string;
  sections: WorkSection[];
};

const studyBody =
  "Lorem ipsum dolor sit amet consectetur. Egestas ultricies interdum egestas proin. Tincidunt sed dolor aenean ultricies sed commodo scelerisque libero arcu. Blandit urna id ut nec.";

function studyImage(span: WorkImage["span"]): WorkImage {
  return { src: "/magic.png", span };
}

function studySections(title: string): WorkSection[] {
  return [
    {
      title: `${title}- Discovery`,
      body: studyBody,
      images: [studyImage("half"), studyImage("half"), studyImage("full")],
    },
    {
      title: "The design",
      body: studyBody,
      images: [studyImage("half"), studyImage("half"), studyImage("full")],
    },
    {
      title: "The delivery",
      body: studyBody,
      images: [studyImage("full")],
    },
  ];
}

export const workFilters: { id: WorkFilter; label: string }[] = [
  { id: "all", label: "All case studies" },
  { id: "logo", label: "Logo & brand design" },
  { id: "product", label: "Product UI/UX design" },
  { id: "packaging", label: "Packaging" },
];

export const selectedWork: WorkItem[] = [
  {
    id: "magic",
    title: "Magic",
    category: "Brand Identity",
    client: "Quality Steel and Plastic",
    director: "Yinka Jayeola",
    filters: ["logo"],
    image: "/magic.png",
    sections: studySections("Magic"),
  },
  {
    id: "frostflow",
    title: "Frostflow",
    category: "Brand Identity, Web UI/UX Design",
    client: "Frostflow Foods",
    director: "Yinka Jayeola",
    filters: ["logo", "product"],
    image: "/magic.png",
    sections: studySections("Frostflow"),
  },
  {
    id: "root-diamonds",
    title: "Root Diamonds",
    category: "Product UI/UX Design",
    client: "Root Diamonds",
    director: "Yinka Jayeola",
    filters: ["product"],
    image: "/magic.png",
    sections: studySections("Root Diamonds"),
  },
  {
    id: "coral-health",
    title: "Coral Health",
    category: "Product UI/UX Design",
    client: "Coral Health",
    director: "Yinka Jayeola",
    filters: ["product"],
    image: "/magic.png",
    sections: studySections("Coral Health"),
  },
  {
    id: "royal-george",
    title: "Royal George",
    category: "Packaging",
    client: "The Royal George",
    director: "Yinka Jayeola",
    filters: ["packaging"],
    image: "/magic.png",
    sections: studySections("Royal George"),
  },
];

export function getProject(slug: string) {
  const index = selectedWork.findIndex((item) => item.id === slug);
  if (index < 0) return null;

  const count = selectedWork.length;
  return {
    project: selectedWork[index],
    previous: selectedWork[(index - 1 + count) % count],
    next: selectedWork[(index + 1) % count],
  };
}

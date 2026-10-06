export type WorkFilter = "all" | "logo" | "product" | "packaging";

export type WorkImage = {
  src: string;
  span: "half" | "full";
};

export type WorkSection = {
  title: string;
  body: string;
  images: WorkImage[];
  video?: string;
  poster?: string;
};

export type WorkItem = {
  id: string;
  title: string;
  category: string;
  categories: string[];
  client: string;
  director: string;
  filters: Exclude<WorkFilter, "all">[];
  image: string;
  sections: WorkSection[];
};

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

export type WorkCredit = {
  role: string;
  name: string;
};

export type WorkItem = {
  id: string;
  title: string;
  category: string;
  categories: string[];
  client: string;
  year: string;
  director: string;
  credits: WorkCredit[];
  filters: Exclude<WorkFilter, "all">[];
  image: string;
  imageMobile: string;
  showOnHome: boolean;
  marqueeImage: string;
  sections: WorkSection[];
};

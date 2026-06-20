export type SectionType = "hero" | "features" | "gallery" | "products" | "lead";

export type SiteSection = {
  id: string;
  type: SectionType;
  title: string;
  body: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: "Active" | "Draft";
};

export type Lead = { id: string; name: string; email: string; source: string; createdAt: string };
export type Order = { id: string; customer: string; total: number; status: "Paid" | "Packing" | "Shipped" | "Delivered" };

export type Website = {
  id: string;
  name: string;
  slug: string;
  status: "Draft" | "Published";
  sections: SiteSection[];
  updatedAt: string;
};

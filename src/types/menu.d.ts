export interface MenuImage {
  id: string;
  path: string;
}

export interface Menu {
  id: string;
  name: string;
  description: string?;
  price: number;
  images: MenuImage[];
}

export interface Category {
  id: string;
  outletId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  menus: Menu[];
}

export interface CategoryMap {
  [key: string]: Category;
}

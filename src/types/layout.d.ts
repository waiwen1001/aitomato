export interface LayoutRequest {
  outletId: string;
  layout: LayoutPage[];
}

export interface LayoutPage {
  floor: string;
  layouts: Layout[];
}

export interface Layout {
  outletId: string;
  floorId: string;
  status: string;
  seq: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  pax: number;
  merge: number[];
  mergedTable: string;
}

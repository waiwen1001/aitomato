export interface TableRequest {
  outletId: string;
  layout: TableLayout[];
}

export interface TableLayout {
  floor: string;
  table: Table[];
}

export interface Table {
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

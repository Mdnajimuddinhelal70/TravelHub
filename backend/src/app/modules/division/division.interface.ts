/* ============================================================
 *  DIVISION
 * ============================================================ */

export interface IDivision {
  name: string;
  slug: string;
  thumbnail?: string;
  images?: string[];
  description?: string;
  districts?: string[];
  location?: { type: "Point"; coordinates: [number, number] };
  isActive: boolean;
}

export interface ICreateDivisionInput {
  name: string;
  thumbnail?: string;
  images?: string[];
  description?: string;
  districts?: string[];
  location?: { type: "Point"; coordinates: [number, number] };
  isActive?: boolean;
}

// Update-এ সব field optional
export type IUpdateDivisionInput = Partial<ICreateDivisionInput>;

import type { IDivision } from "./division.interface";

export interface IDestination {
  _id: string;
  name: string;
  slug: string;
  division: IDivision | string;
  thumbnail?: string;
  images?: string[];
  description?: string;
  location?: { type: "Point"; coordinates: [number, number] };
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IDivision {
  _id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  images?: string[];
  description?: string;
  districts?: string[];
  location?: { type: "Point"; coordinates: [number, number] };
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

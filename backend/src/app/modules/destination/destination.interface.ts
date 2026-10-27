import { Types } from "mongoose";

export interface IDestination {
  name: string;
  slug: string;
  division: Types.ObjectId;
  thumbnail?: string;
  images?: string[];
  description?: string;
  location?: { type: "Point"; coordinates: [number, number] };
  isActive: boolean;
  isDeleted?: boolean;
}

export interface ICreateDestinationInput {
  name: string;
  division: string;
  thumbnail?: string;
  images?: string[];
  description?: string;
  location?: { type: "Point"; coordinates: [number, number] };
  isActive?: boolean;
}

export type IUpdateDestinationInput = Partial<ICreateDestinationInput>;

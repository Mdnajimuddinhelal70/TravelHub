import { Types } from "mongoose";

export interface ITour {
  title: string;
  slug: string;
  description?: string;
  images: string[];
  destinations: Types.ObjectId[];
  tourType: Types.ObjectId;
  included: string[];
  excluded: string[];
  amenities: string[];
  tourPlan: string[];
  maxGuest?: number;
  minAge?: number;
}

export interface ITourType {
  name: string;
  slug: string;
  description?: string;
}

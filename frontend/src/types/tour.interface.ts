import { IDestination } from "./destination.interface";
import { IDivision } from "./division.interface";

export type TourCategory =
  | "group"
  | "family"
  | "honeymoon"
  | "adventure"
  | "corporate";

export type TourDifficulty = "easy" | "moderate" | "hard";
export type TourStatus = "draft" | "published" | "archived";

export interface ITourPlan {
  day: number;
  title: string;
  description?: string;
  meals?: string[];
  accommodation?: string;
}

export interface ITourType {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

export interface ITour {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  images: string[];
  destinations: IDestination[] | string[];
  primaryDestination?: IDestination | string;
  tourType: ITourType | string;
  category?: TourCategory;
  difficulty?: TourDifficulty;
  duration: { days: number; nights: number };
  price: {
    adult: number;
    child?: number;
    discountPercent?: number;
  };
  included: string[];
  excluded: string[];
  amenities: string[];
  tourPlan: ITourPlan[];
  minGroupSize?: number;
  maxGuest?: number;
  minAge?: number;
  cancellationPolicy?: string;
  rating: number;
  totalReviews: number;
  status: TourStatus;
  isDeleted?: boolean;
  division?: IDivision | string;
  createdAt: string;
  updatedAt: string;
}

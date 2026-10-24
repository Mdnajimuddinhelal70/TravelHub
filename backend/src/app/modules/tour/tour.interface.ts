import { Types } from "mongoose";

/* ============================================================
 *  TOUR
 * ============================================================ */
export interface ITour {
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  images: string[];
  destinations: Types.ObjectId[];
  primaryDestination?: Types.ObjectId;
  tourType: Types.ObjectId;
  category?: "group" | "family" | "honeymoon" | "adventure" | "corporate";
  difficulty?: "easy" | "moderate" | "hard";
  duration: { days: number; nights: number };
  price: {
    adult: number;
    child?: number;
    discountPercent?: number;
  };
  included: string[];
  excluded: string[];
  amenities: string[];
  tourPlan: {
    day: number;
    title: string;
    description: string;
    meals?: string[];
    accommodation?: string;
  }[];
  minGroupSize?: number;
  maxGuest?: number;
  minAge?: number;
  cancellationPolicy?: string;
  rating: number; // default 0, review থেকে আপডেট হবে
  totalReviews: number; // default 0
  status: "draft" | "published" | "archived"; // default 'draft'
}

export interface ICreateTourInput {
  title: string;
  description?: string;
  coverImage?: string;
  images?: string[];
  destinations: string[]; // ObjectId string হিসেবে আসবে
  primaryDestination?: string;
  tourType: string;
  category?: ITour["category"];
  difficulty?: ITour["difficulty"];
  duration: { days: number; nights: number };
  price: {
    adult: number;
    child?: number;
    discountPercent?: number;
  };
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: ITour["tourPlan"];
  minGroupSize?: number;
  maxGuest?: number;
  minAge?: number;
  cancellationPolicy?: string;
}

export type IUpdateTourInput = Partial<ICreateTourInput>;

/* ============================================================
 *  TOUR TYPE
 * ============================================================ */

export interface ITourType {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean; // default true
}

export interface ICreateTourTypeInput {
  name: string;
  description?: string;
  icon?: string;
  isActive?: boolean; // optional, default true
}

export type IUpdateTourTypeInput = Partial<ICreateTourTypeInput>;

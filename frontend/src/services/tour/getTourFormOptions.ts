"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { ApiResponse, IDestination, IDivision, ITourType } from "@/types";

export interface TourFormOptions {
  tourTypes: ITourType[];
  divisions: IDivision[];
  destinations: IDestination[];
}

export async function getTourFormOptions(): Promise<TourFormOptions> {
  try {
    const [typesRes, divRes, destRes] = await Promise.all([
      serverFetch.get("/tour/tour-types?limit=100"),
      serverFetch.get("/division?limit=100"),
      serverFetch.get("/destination?limit=200"),
    ]);

    const [typesJson, divJson, destJson] = await Promise.all([
      typesRes.json() as Promise<ApiResponse<ITourType[]>>,
      divRes.json() as Promise<ApiResponse<IDivision[]>>,
      destRes.json() as Promise<ApiResponse<IDestination[]>>,
    ]);

    return {
      tourTypes: typesJson.success ? (typesJson.data ?? []) : [],
      divisions: divJson.success ? (divJson.data ?? []) : [],
      destinations: destJson.success ? (destJson.data ?? []) : [],
    };
  } catch {
    return { tourTypes: [], divisions: [], destinations: [] };
  }
}

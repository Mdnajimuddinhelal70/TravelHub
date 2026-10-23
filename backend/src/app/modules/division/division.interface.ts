export interface IDivision {
  name: string;
  slug: string;
  thumbnail?: string;
  description?: string;
}

export interface ICreateDivisionInput {
  name: string;
  thumbnail?: string;
  description?: string;
}

export interface IUpdateDivisionInput {
  name?: string;
  thumbnail?: string;
  description?: string;
}

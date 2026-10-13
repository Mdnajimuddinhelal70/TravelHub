export interface IInputErrorState {
  success: boolean;
  errors?: Record<string, string[] | undefined>;
  message?: string;
}

export const getInputFieldError = (
  fieldName: string,
  state: IInputErrorState | null,
): string | null => {
  if (!state?.errors) {
    return null;
  }

  const error = state.errors[fieldName];

  return error?.[0] ?? null;
};

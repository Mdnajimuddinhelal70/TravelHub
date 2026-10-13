/* eslint-disable @typescript-eslint/no-explicit-any */
export const zodValidator = (data: any, schema: any) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    };
  }

  return {
    success: true,
    data: result.data,
  };
};

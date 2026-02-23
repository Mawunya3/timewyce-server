import { ZodError } from "zod";

export function formatZodError(err: ZodError) {
  return {
    message: "Validation failed",
    issues: err.issues.map(i => ({
      path: i.path.join("."),
      code: i.code,
      message: i.message,
    })),
  };
}

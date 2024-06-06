import { z } from "zod";
import { REGEX_EMAIL } from "../../constants/regex";

export const createUserDTO = z.object({
  username: z.string({
    required_error: "Username is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .regex(REGEX_EMAIL, "Invalid email type"),
  password: z.string(),
});

export const loginUserDTO = z.object({
  email: z.string({
    required_error: "Email is required",
  }),
  password: z.string({
    required_error: "Password is required",
  }),
});

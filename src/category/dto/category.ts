import { z } from "zod";

const categoryDTO = z.object({
  name: z.string({
    required_error: "Category name is required",
  }),
});
export default categoryDTO;

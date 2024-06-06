import { z } from "zod";

const articleDTO = z.object({
  title: z.string({ required_error: "Article Title is required" }),
  content: z.string({ required_error: "Article content is required" }),
  categoryId: z.string({ required_error: "Category id is required" }),
});

export default articleDTO;

import z from "zod";

export const teamSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  division: z.enum(["Front End", "Back End", "QA", "UI/UX"]),
});

export type TeamMemberInput = z.infer<typeof teamSchema>;

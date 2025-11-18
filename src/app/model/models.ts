import z from 'zod';

export type Challenge = z.infer<typeof challengeSchema>;
export const challengeSchema = z.object({
  word: z.string().min(1),
});

import z from 'zod';

export type Challenge = z.infer<typeof challengeSchema>;
export const challengeSchema = z.object({
  word: z.string().min(1),
  guessLimit: z.number().optional(),
  allowNonsense: z.boolean().optional(),
});

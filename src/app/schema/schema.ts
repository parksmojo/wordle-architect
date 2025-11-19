import z from 'zod';

export type Challenge = z.infer<typeof challengeSchema>;
export const challengeSchema = z.object({
  word: z.string().min(1),
  guessLimit: z.number(),
  allowNonsense: z.boolean().optional(),
});

export type Color = 'b' | 'y' | 'g';
export const colorToHex = (color: Color | undefined) => {
  const map = {
    b: '#3a3a3c',
    y: '#b59f3b',
    g: '#538d4e',
  } as const;
  return color ? map[color] : '#818384';
};

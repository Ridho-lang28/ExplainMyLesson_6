// lib/schema.ts
//
// Skema validasi Zod bersama, dipakai baik di Client Components (validasi UX
// instan sebelum submit) maupun di Route Handlers (validasi ulang di server —
// "never trust the client"), sesuai Modul 6 poin H (Type-Safe Data Layer).

import { z } from "zod";

export const MaterialUploadSchema = z.object({
  title: z.string().trim().min(5, "Judul minimal 5 karakter."),
  fileName: z
    .string()
    .toLowerCase()
    .refine((name) => name.endsWith(".pdf"), "Format file harus PDF."),
  chapter: z.string().optional(),
});

export type MaterialUploadInput = z.infer<typeof MaterialUploadSchema>;

export const QuizAnswerSchema = z.object({
  level: z.number().int().min(1).max(3),
  questionId: z.string(),
  selectedOption: z.number().int().min(0),
});

export type QuizAnswerInput = z.infer<typeof QuizAnswerSchema>;

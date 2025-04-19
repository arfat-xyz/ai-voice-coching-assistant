import { z } from "zod";

export const createDiscussionRoomZod = z.object({
  coachingOption: z.string().min(1, "Coaching option is required"),
  expertName: z.string().min(1, "Please select an expert"),
  topic: z.string().min(1, "Topic is required"),
});

export type CreateDiscussionRoomFormValues = z.infer<
  typeof createDiscussionRoomZod
>;

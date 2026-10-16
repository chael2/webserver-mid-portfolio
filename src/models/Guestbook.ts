import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const GuestbookSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 20 },
    message: { type: String, required: true, trim: true, maxlength: 300 },
  },
  { timestamps: true },
);
GuestbookSchema.index({ createdAt: -1 });

export type GuestbookDoc = InferSchemaType<typeof GuestbookSchema>;
export const Guestbook =
  (models.Guestbook as Model<GuestbookDoc>) || model<GuestbookDoc>("Guestbook", GuestbookSchema);

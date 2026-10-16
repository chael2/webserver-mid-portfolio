import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const GuestbookSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 20 },
    message: { type: String, required: true, trim: true, maxlength: 300 },
    // 도배 방지용. IP 원문이 아니라 솔트를 섞은 SHA-256 해시만 저장하고, 조회 시 기본으로 제외
    ipHash: { type: String, select: false, index: true },
  },
  { timestamps: true },
);
GuestbookSchema.index({ createdAt: -1 });

export type GuestbookDoc = InferSchemaType<typeof GuestbookSchema>;
export const Guestbook =
  (models.Guestbook as Model<GuestbookDoc>) || model<GuestbookDoc>("Guestbook", GuestbookSchema);

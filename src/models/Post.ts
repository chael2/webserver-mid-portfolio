import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

/** 블로그 최신 글 (Tistory 링크) */
const PostSchema = new Schema({
  title: { type: String, required: true },
  tag: String,
  summary: String,
  url: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 },
});

export type PostDoc = InferSchemaType<typeof PostSchema>;
export const Post = (models.Post as Model<PostDoc>) || model<PostDoc>("Post", PostSchema);

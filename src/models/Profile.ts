import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

/** 사이트 주인 프로필 (문서 1개, key = "main"). 학번·전화번호 같은 개인정보 필드는 두지 않습니다. */
const ProfileSchema = new Schema({
  key: { type: String, required: true, unique: true, default: "main" },
  name: { type: String, required: true },
  handle: { type: String, required: true },
  headline: String,
  intro: String,
  tagline: String,
  about: String,
  typingWords: { type: [String], default: [] },
  fields: { type: [{ label: String, icon: String }], default: [] },
  links: { github: String, blog: String, email: String },
  blogTitle: String,
  blogDescription: String,
});

export type ProfileDoc = InferSchemaType<typeof ProfileSchema>;
export const Profile = (models.Profile as Model<ProfileDoc>) || model<ProfileDoc>("Profile", ProfileSchema);

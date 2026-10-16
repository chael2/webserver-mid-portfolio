import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const TeamMemberSchema = new Schema({
  name: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  color: { type: String, default: "#9333ea" },
  githubUrl: String,
  blogUrl: String,
  portfolioUrl: String,
  order: { type: Number, default: 0 },
});

export type TeamMemberDoc = InferSchemaType<typeof TeamMemberSchema>;
export const TeamMember =
  (models.TeamMember as Model<TeamMemberDoc>) || model<TeamMemberDoc>("TeamMember", TeamMemberSchema);

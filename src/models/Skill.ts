import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const SkillSchema = new Schema({
  name: { type: String, required: true, unique: true },
  group: { type: String, enum: ["language", "framework", "tool"], required: true },
  icon: { type: String, default: "code" },
  color: { type: String, default: "#06b6d4" },
  note: String,
  order: { type: Number, default: 0 },
});

export type SkillDoc = InferSchemaType<typeof SkillSchema>;
export const Skill = (models.Skill as Model<SkillDoc>) || model<SkillDoc>("Skill", SkillSchema);

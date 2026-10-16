import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

/** 이력 정보 (팀 프로젝트 개발 과정) */
const TimelineSchema = new Schema({
  step: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

export type TimelineDoc = InferSchemaType<typeof TimelineSchema>;
export const Timeline = (models.Timeline as Model<TimelineDoc>) || model<TimelineDoc>("Timeline", TimelineSchema);

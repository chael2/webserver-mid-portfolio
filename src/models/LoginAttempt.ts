import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

/** 로그인 실패 기록. 15분 뒤 MongoDB TTL 인덱스가 자동 삭제 */
const LoginAttemptSchema = new Schema({
  ipHash: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 15 },
});

export type LoginAttemptDoc = InferSchemaType<typeof LoginAttemptSchema>;
export const LoginAttempt =
  (models.LoginAttempt as Model<LoginAttemptDoc>) || model<LoginAttemptDoc>("LoginAttempt", LoginAttemptSchema);

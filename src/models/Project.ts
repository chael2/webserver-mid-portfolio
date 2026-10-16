import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const ProjectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    badge: String,
    summary: { type: String, required: true },
    category: { type: String, enum: ["web", "security", "hardware", "study"], required: true },
    kind: { type: String, enum: ["personal", "team", "assignment"], default: "personal" },
    stack: { type: [String], default: [] },
    icon: { type: String, default: "code" },
    githubUrl: String, // GitHub 저장소 주소
    deployUrl: String, // 실제 배포 주소
    isCurrentCourse: { type: Boolean, default: false }, // 현재 강의 실습 프로젝트
    showOnGithub: { type: Boolean, default: false }, // GitHub 페이지 저장소 목록 노출
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type ProjectDoc = InferSchemaType<typeof ProjectSchema>;
export const Project = (models.Project as Model<ProjectDoc>) || model<ProjectDoc>("Project", ProjectSchema);

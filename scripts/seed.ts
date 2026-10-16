/**
 * 초기 데이터 입력: npm run seed
 * src/data/seed-data.ts 내용을 MongoDB에 upsert 합니다 (여러 번 실행해도 중복되지 않음).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import mongoose from "mongoose";
import { Project } from "../src/models/Project";
import { Skill } from "../src/models/Skill";
import { TeamMember } from "../src/models/TeamMember";
import { Timeline } from "../src/models/Timeline";
import { Profile } from "../src/models/Profile";
import { Post } from "../src/models/Post";
import {
  profileSeed,
  projectsSeed,
  skillsSeed,
  teamSeed,
  timelineSeed,
  postsSeed,
} from "../src/data/seed-data";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI가 없습니다. .env.local을 확인하세요.");

  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB ?? "portfolio" });
  console.log(`connected → ${mongoose.connection.name}`);

  await Profile.updateOne({ key: profileSeed.key }, profileSeed, { upsert: true });
  for (const p of projectsSeed) await Project.updateOne({ slug: p.slug }, p, { upsert: true });
  for (const s of skillsSeed) await Skill.updateOne({ name: s.name }, s, { upsert: true });
  for (const m of teamSeed) await TeamMember.updateOne({ name: m.name }, m, { upsert: true });
  for (const t of timelineSeed) await Timeline.updateOne({ step: t.step }, t, { upsert: true });
  for (const p of postsSeed) await Post.updateOne({ url: p.url }, p, { upsert: true });
  await Promise.all([Project, Skill, TeamMember, Timeline, Profile, Post].map((m) => m.syncIndexes()));

  console.log(
    `seeded: profile 1, projects ${projectsSeed.length}, skills ${skillsSeed.length}, ` +
      `team ${teamSeed.length}, timeline ${timelineSeed.length}, posts ${postsSeed.length}`,
  );
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});

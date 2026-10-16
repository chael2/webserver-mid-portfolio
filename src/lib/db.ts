import "server-only";
import mongoose from "mongoose";

// 쿼리 필터에 { $gt: "" } 같은 연산자 객체가 섞여 들어오는 NoSQL Injection 방지
mongoose.set("sanitizeFilter", true);

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

// 서버리스(Vercel)·개발 모드 Hot Reload에서 커넥션이 쌓이지 않도록 전역에 캐시
const g = globalThis as unknown as { _mongoose?: Cache };
const cached: Cache = g._mongoose ?? (g._mongoose = { conn: null, promise: null });

/** MONGODB_URI가 설정돼 있는지 (없으면 seed-data로 화면을 그림) */
export function hasDB() {
  return Boolean(process.env.MONGODB_URI);
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI가 설정되지 않았습니다 (.env.local 또는 Vercel 환경 변수를 확인하세요)");

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB ?? "portfolio",
      bufferCommands: false,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // 실패하면 다음 요청에서 다시 시도
    throw err;
  }
  return cached.conn;
}

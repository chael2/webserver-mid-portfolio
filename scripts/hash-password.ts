/**
 * 관리자 비밀번호 해시 만들기: npm run hash-password -- "내비밀번호"
 * 출력된 값을 .env.local / Vercel 환경 변수의 ADMIN_PASSWORD_HASH에 넣으세요.
 */
import { randomBytes, scrypt } from "node:crypto";

const pw = process.argv[2];
if (!pw || pw.length < 10) {
  console.error('사용법: npm run hash-password -- "10자 이상의 비밀번호"');
  process.exit(1);
}
const salt = randomBytes(16);
scrypt(pw, salt, 64, (err, hash) => {
  if (err) throw err;
  console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("hex")}:${hash.toString("hex")}`);
  console.log(`SESSION_SECRET=${randomBytes(32).toString("base64url")}`);
});

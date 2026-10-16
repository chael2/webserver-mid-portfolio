import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="font-mono text-sm text-accent">404 Not Found</p>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
        페이지를 <span className="accent-text">찾을 수 없습니다</span>
      </h1>
      <Link href="/" className="btn btn-primary mt-8">
        홈으로 돌아가기
      </Link>
    </div>
  );
}

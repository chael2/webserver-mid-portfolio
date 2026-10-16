import { FaArrowUpRightFromSquare, FaGithub } from "react-icons/fa6";

type Props = {
  githubUrl?: string | null;
  deployUrl?: string | null;
  className?: string;
  size?: "sm" | "md";
};

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

/** GitHub 저장소 / 배포 사이트 링크를 색과 라벨로 명확히 구분해서 보여주는 버튼 묶음 */
export function LinkButtons({ githubUrl, deployUrl, className = "", size = "md" }: Props) {
  if (!githubUrl && !deployUrl) return null;
  const sz = size === "sm" ? "btn-sm" : "";
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {githubUrl && (
        <a href={githubUrl} {...ext} className={`btn btn-ghost ${sz}`} aria-label="GitHub 저장소 (새 창)">
          <FaGithub aria-hidden /> GitHub 저장소
        </a>
      )}
      {deployUrl && (
        <a
          href={deployUrl}
          {...ext}
          className={`btn btn-primary ${sz}`}
          aria-label={deployUrl.startsWith("http") ? "배포 사이트 (새 창)" : "데모 열기 (새 창)"}
        >
          <FaArrowUpRightFromSquare aria-hidden /> {deployUrl.startsWith("http") ? "배포 사이트" : "Live Demo"}
        </a>
      )}
    </div>
  );
}

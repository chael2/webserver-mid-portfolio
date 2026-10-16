import type { IconType } from "react-icons";
import {
  FaBug, FaCode, FaCss3Alt, FaDatabase, FaGithub, FaHtml5, FaIdCard, FaJava, FaJs, FaKey,
  FaLinux, FaMicrochip, FaPython, FaServer, FaShieldHalved, FaTerminal,
} from "react-icons/fa6";
import { SiCplusplus, SiMongodb, SiNextdotjs } from "react-icons/si";

/** DB에는 아이콘 이름(문자열)만 저장하고, 화면에서 컴포넌트로 바꿔 그림 */
const ICONS: Record<string, IconType> = {
  bug: FaBug,
  code: FaCode,
  css: FaCss3Alt,
  db: FaDatabase,
  github: FaGithub,
  html: FaHtml5,
  id: FaIdCard,
  java: FaJava,
  js: FaJs,
  key: FaKey,
  linux: FaLinux,
  chip: FaMicrochip,
  python: FaPython,
  server: FaServer,
  shield: FaShieldHalved,
  terminal: FaTerminal,
  c: SiCplusplus,
  mongo: SiMongodb,
  next: SiNextdotjs,
};

export function Icon({ name, className, color }: { name?: string; className?: string; color?: string }) {
  const C = (name && ICONS[name]) || FaCode;
  return <C className={className} style={color ? { color } : undefined} aria-hidden />;
}

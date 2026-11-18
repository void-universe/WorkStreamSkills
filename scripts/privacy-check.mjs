// 发布前的隐私检查：技能包里不许出现本机路径、账号、密钥、内网地址或个人硬件信息。
// 只读扫描，命中即非零退出，适合放进 CI 或提交前手跑。
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.argv[2] ?? ".";
const SKIP = new Set([".git", "node_modules"]);

const RULES = [
  { name: "absolute-windows-path", re: /[A-Za-z]:[\\/](Users|ai|data|tools|Program)/ },
  { name: "absolute-posix-home", re: /\/(Users|home)\/[A-Za-z0-9._-]+\// },
  { name: "email", re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/ },
  { name: "api-key", re: /\b(sk-[A-Za-z0-9]{12,}|ghp_[A-Za-z0-9]{20,}|xox[abp]-)/ },
  { name: "private-key-block", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: "ipv4", re: /\b(?!0\.)(?:\d{1,3}\.){3}\d{1,3}\b/ },
  { name: "loopback-or-port", re: /\b(127\.0\.0\.1|localhost):\d+/ },
  { name: "hardware", re: /\b(RTX\s?\d{4}|GTX\s?\d{3,4}|A100|H100|5090|4090|5060)\b/i },
  { name: "local-tooling", re: /\b(ComfyUI|venv|conda|nvidia-smi)\b/i },
  { name: "demo-account", re: /@workstream\.dev/i },
];

const hits = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    const info = statSync(full);
    if (info.isDirectory()) { walk(full); continue; }
    if (!/\.(md|json)$/i.test(entry)) continue;
    const lines = readFileSync(full, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const rule of RULES) {
        if (rule.re.test(line)) hits.push({ file: full, line: index + 1, rule: rule.name, text: line.trim().slice(0, 100) });
      }
    });
  }
}

walk(ROOT);
if (!hits.length) {
  console.log(`privacy check: clean (${RULES.length} rules)`);
  process.exit(0);
}
console.log(`privacy check: ${hits.length} hit(s)`);
for (const hit of hits) console.log(`  ${hit.file}:${hit.line} [${hit.rule}] ${hit.text}`);
process.exit(1);

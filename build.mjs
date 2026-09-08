import {
  cpSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { join } from "node:path";

mkdirSync("dist", { recursive: true });
cpSync("assignments", "dist/assignments", { recursive: true });
if (existsSync("labs")) cpSync("labs", "dist/labs", { recursive: true });

const sections = ["assignments", "labs"];
const items = [];
for (const section of sections) {
  if (!existsSync(section)) continue;
  for (const dir of readdirSync(section, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const files = readdirSync(join(section, dir.name)).filter((f) =>
      f.endsWith(".html"),
    );
    for (const f of files) {
      items.push({ section, dir: dir.name, file: f });
    }
  }
}

const list = items
  .map(
    (i) =>
      `      <li><a href="/${i.section}/${encodeURIComponent(i.dir)}/${i.file}">${i.dir} — ${i.file}</a></li>`,
  )
  .join("\n");

writeFileSync(
  "dist/index.html",
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GP217 WED211 ВЕБ ХӨГЖҮҮЛЭЛТ Н.Мөнхпүрэв B25FM1243
</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 3rem auto; padding: 0 1rem; background: #edf3f0; color: #222; }
    h1 { border-bottom: 2px solid #222; padding-bottom: .5rem; }
    ul { list-style: none; padding: 0; }
    li { margin: .5rem 0; }
    a { display: block; padding: .75rem 1rem; background: #fff; border: 1px solid #e2e2e2; border-radius: 8px; text-decoration: none; color: #14231f; }
    a:hover { border-color: #c9d4ce; }
    small { color: #777; }
  </style>
</head>
<body>
  <h1>GP217 WED211 ВЕБ ХӨГЖҮҮЛЭЛТ Н.Мөнхпүрэв B25FM1243</h1>
  <ul>
${list}
  </ul>
</body>
</html>
`,
);

console.log(`Generated homepage with ${items.length} item(s).`);

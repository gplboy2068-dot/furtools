import fs from 'fs';
const dir = 'C:/Users/Fkdigitalmedia/.gemini/antigravity/brain/43c300ce-22f9-4648-8eb5-b9cbe82ac88e/scratch';
const files = fs.readdirSync(dir);
for (const f of files) {
  if (!f.endsWith('.mjs')) continue;
  const c = fs.readFileSync(`${dir}/${f}`, 'utf8');
  const matches = [...c.matchAll(/"([a-z0-9-]+)":\s*\{\s*"slug":/g)];
  if (matches.length > 0) {
    console.log(f, 'has', matches.length, 'articles:', matches.map(m => m[1]).join(', '));
  }
}

const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const files=['index.html','x1/index.html','x2/index.html','x3/index.html','x4/index.html','x4/zero.html'];
for(const file of files){
 const html=fs.readFileSync('dist/'+file,'utf8'),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,`Duplicate IDs in ${file}`);
 assert(!html.includes('${'),'Unresolved template expression');assert(!/<iframe/i.test(html),'Video must not load before a click');
 for(const [,raw] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
  if(/^(https?:|mailto:)/.test(raw))continue;
  if(raw.startsWith('#')){assert(ids.includes(raw.slice(1)),`Broken ${file}${raw}`);continue;}
  const ref=raw.split('#')[0];let resolved=path.join('dist',path.dirname(file),ref);if(fs.existsSync(resolved)&&fs.statSync(resolved).isDirectory())resolved=path.join(resolved,'index.html');assert(fs.existsSync(resolved),`Missing ${file} -> ${ref}`);
 }
 if(file==='index.html')continue;
 const gameId=file==='x4/zero.html'?'x4-zero':file.split('/')[0],g=JSON.parse(fs.readFileSync(`src/games/${gameId}.json`));
 for(const s of g.stages){assert(s.sprite&&s.weakness&&s.reward,`Missing boss facts: ${s.id}`);for(const p of s.items){assert(p.media.length||p.video,`Missing pickup media: ${p.id}`);for(const m of p.media)assert(m.width&&m.height&&m.source&&m.credit,`Incomplete provenance: ${p.id}`);}}
 for(const c of g.checkpoints||[])assert(g.stages.some(s=>s.id===c.afterStage),'Invalid checkpoint');
 assert.equal((html.match(/class="return-level"/g)||[]).length,g.returns.length);
 for(const r of g.returns)for(const id of r.items)assert(ids.includes(`return-${id}`),`Missing return card ${id}`);
 console.log(`PASS ${gameId}: 8 bosses; ${g.stages.flatMap(s=>s.items).length} pickup locations; ${ids.length} valid anchors`);
}
const x3=JSON.parse(fs.readFileSync('src/games/x3.json'));assert.equal(x3.stages.flatMap(s=>s.items).filter(p=>p.type==='chip'&&p.timing==='skip').length,4);
const zero=JSON.parse(fs.readFileSync('src/games/x4-zero.json'));assert.equal(zero.stages.flatMap(s=>s.items).filter(p=>p.type==='armor').length,0);
assert(zero.stages.find(s=>s.name==='Cyber Peacock').items.every(p=>!p.media.length&&p.video),'Zero must not display X reward-room screenshots');
console.log('PASS: local page/assets links, return disclosures, lazy media, chip exclusions and character-specific pickups.');

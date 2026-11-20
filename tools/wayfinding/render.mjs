// node render.mjs <html> <outdir> id[:transparent] ...
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
const [html, out, ...ids] = process.argv.slice(2);
const dir = mkdtempSync('/tmp/wfr');
const ch = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--disable-gpu','--hide-scrollbars','--allow-file-access-from-files','--remote-debugging-port=0',`--user-data-dir=${dir}`,'about:blank']);
const wsUrl = await new Promise(r => ch.stderr.on('data', d => { const m = String(d).match(/ws:\/\/\S+/); if (m) r(m[0]); }));
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {};
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } if (m.method==='Runtime.consoleAPICalled') console.log('console', JSON.stringify(m.params.args.map(a=>a.value))); };
const send = (method, params = {}, sessionId) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank' });
const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => send(m, p, sessionId);
await S('Runtime.enable'); await S('Page.enable');
await S('Emulation.setDeviceMetricsOverride', { width: 2600, height: 1600, deviceScaleFactor: 1, mobile: false });
await S('Page.navigate', { url: 'file://' + html });
await new Promise(r => setTimeout(r, 3500));
const ev = async (e) => (await S('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result.result?.value;
console.log('fonts', await ev(`document.fonts.ready.then(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight).join(', '))`));
for (const spec of ids) {
  const [sel, mode] = spec.split(':');
  if (mode === 'transparent') await S('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
  else await S('Emulation.setDefaultBackgroundColorOverride', {});
  const r = await ev(`(()=>{const e=document.querySelector(${JSON.stringify(sel)});const b=e.getBoundingClientRect();return {x:b.x+scrollX,y:b.y+scrollY,w:b.width,h:b.height}})()`);
  const scale = (mode === 'transparent' || mode === '2x') ? 2 : 1;
  const { result } = await S('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale } });
  const name = sel.replace(/[#.]/g, '');
  writeFileSync(`${out}/${name}.png`, Buffer.from(result.data, 'base64'));
  console.log('wrote', name, Math.round(r.w*scale)+'x'+Math.round(r.h*scale));
}
ch.kill(); process.exit(0);

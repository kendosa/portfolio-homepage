// exports each sign group as a transparent 2x PNG
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
const [html, out] = process.argv.slice(2);
const ch = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--disable-gpu','--hide-scrollbars','--allow-file-access-from-files','--remote-debugging-port=0',`--user-data-dir=${mkdtempSync('/tmp/wfe')}`,'about:blank']);
const wsUrl = await new Promise(r => ch.stderr.on('data', d => { const m = String(d).match(/ws:\/\/\S+/); if (m) r(m[0]); }));
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } };
const send = (method, params = {}, sessionId) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank' });
const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => send(m, p, sessionId);
await S('Page.enable'); await S('Runtime.enable');
await S('Emulation.setDeviceMetricsOverride', { width: 2600, height: 1600, deviceScaleFactor: 1, mobile: false });
await S('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
await S('Page.navigate', { url: 'file://' + html });
await new Promise(r => setTimeout(r, 3500));
const ev = async (e) => (await S('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result.result?.value;
await ev(`document.fonts.ready.then(()=>{const st=document.createElement('style');st.textContent='body{background:transparent!important}.wall,.wall.warm,.wall.ceiling{background:transparent!important}.wall::before{display:none}.wall>div:not(.sign):not(.rod){display:none}.sign{box-shadow:none!important}.rod{display:none}';document.head.appendChild(st);return 1})`);
const groups = {
  'directional-stack': '#c-lobby .arrow, #c-lobby .panel',
  'floor-directory': '#c-lobby .dir',
  'room-id': '#c-room .room',
  'parking-garage': '#c-exterior > .sign:nth-of-type(1), #c-exterior > .arrow:last-of-type',
  'emergency-entrance': '#c-exterior > .panel.t, #c-exterior > .arrow[style*="emergency"]',
  'overhead-blade': '#c-overhead .blade',
};
for (const [name, sel] of Object.entries(groups)) {
  const r = await ev(`(()=>{const els=[...document.querySelectorAll(${JSON.stringify(sel)})];let x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;for(const e of els){const b=e.getBoundingClientRect();x1=Math.min(x1,b.left);y1=Math.min(y1,b.top);x2=Math.max(x2,b.right);y2=Math.max(y2,b.bottom)}return {n:els.length,x:x1+scrollX,y:y1+scrollY,w:x2-x1,h:y2-y1}})()`);
  const { result } = await S('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 2 } });
  writeFileSync(`${out}/endeavor-wayfinding-${name}.png`, Buffer.from(result.data, 'base64'));
  console.log(name, r.n, 'elements', Math.round(r.w*2)+'x'+Math.round(r.h*2));
}
ch.kill(); process.exit(0);

import { readFileSync } from 'fs';
import { createServer } from 'http';

const env = {};
for (const l of readFileSync('D:/blinxpaco-test/.env', 'utf8').split('\n')) {
  const m = l.match(/^([^=]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}

const body = `(async function(){
  function setReactValue(el,val){const n=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;n.call(el,val);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}
  const u=document.querySelector('input[placeholder="Username"]');
  const pw=document.querySelector('input[type="password"]');
  if(!u||!pw) return {step:'no_inputs'};
  setReactValue(u, ${JSON.stringify(env.PAC_USERNAME)});
  setReactValue(pw, ${JSON.stringify(env.PAC_PASSWORD)});
  await wait(400);
  const btn=Array.from(document.querySelectorAll('button')).find(b=>(b.innerText||'').trim().toLowerCase().includes('sign in'));
  if(!btn) return {step:'no_button'};
  btn.click();
  await wait(7000);
  return {step:'done', url:location.href, token: sessionStorage.getItem('token')?'present':null};
})();`;

createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/javascript', 'Access-Control-Allow-Origin': '*' });
  res.end(body);
}).listen(8765, () => console.log('serving 8765'));

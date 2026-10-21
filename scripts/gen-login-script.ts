import { readFileSync } from 'fs';
const lines = readFileSync('.env','utf8').split('\n');
for(const l of lines) {
  const m=l.match(/^([^=]+)=(.*)$/);
  if(m) process.env[m[1]]=m[2];
}
const {buildMcpLoginScript, loadCredentials} = await import('./paco-auth-helper.js');
const creds = loadCredentials();
const script = buildMcpLoginScript(creds);
process.stdout.write(script);

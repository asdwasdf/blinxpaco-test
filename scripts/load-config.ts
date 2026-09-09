// scripts/load-config.ts
import fs from 'fs';
import YAML from 'yaml';

export function loadConfig() {
  const content = fs.readFileSync('paco.config.yaml', 'utf8');
  return YAML.parse(content);
}

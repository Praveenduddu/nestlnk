import fs from 'fs';
import path from 'path';

const SRC_DIR = '/home/praveen/Documents/projects/Interior Colab/frontend/src';

const replacements = [
  // Backgrounds
  { from: /bg-\[#0F172A\]/g, to: 'bg-slate-50 dark:bg-[#0F172A]' },
  { from: /bg-slate-900\/50/g, to: 'bg-white/50 dark:bg-slate-900/50' },
  { from: /bg-slate-900/g, to: 'bg-white dark:bg-slate-900' },
  { from: /bg-slate-800\/50/g, to: 'bg-slate-100/50 dark:bg-slate-800/50' },
  { from: /bg-slate-800/g, to: 'bg-slate-200 dark:bg-slate-800' },
  
  // Text
  { from: /text-white\/60/g, to: 'text-slate-600 dark:text-white/60' },
  { from: /text-white\/80/g, to: 'text-slate-700 dark:text-white/80' },
  { from: /text-white/g, to: 'text-slate-900 dark:text-white' },
  { from: /text-slate-400/g, to: 'text-slate-500 dark:text-slate-400' },
  { from: /text-slate-300/g, to: 'text-slate-600 dark:text-slate-300' },
  { from: /text-slate-200/g, to: 'text-slate-700 dark:text-slate-200' },
  
  // Borders
  { from: /border-white\/10/g, to: 'border-slate-200 dark:border-white/10' },
  { from: /border-white\/20/g, to: 'border-slate-300 dark:border-white/20' },
  { from: /border-slate-800/g, to: 'border-slate-200 dark:border-slate-800' },
  
  // Hover states
  { from: /hover:bg-white\/5/g, to: 'hover:bg-slate-100 dark:hover:bg-white/5' },
  { from: /hover:bg-white\/10/g, to: 'hover:bg-slate-200 dark:hover:bg-white/10' },
  { from: /hover:text-white/g, to: 'hover:text-slate-900 dark:hover:text-white' },
  
  // Ring/Focus
  { from: /ring-white\/10/g, to: 'ring-slate-200 dark:ring-white/10' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Apply replacements
  for (const rule of replacements) {
    content = content.replace(rule.from, rule.to);
  }

  // Deduplicate redundant classes that might occur from multiple runs or overlapping rules
  content = content.replace(/text-slate-900 dark:text-slate-900 dark:text-white/g, 'text-slate-900 dark:text-white');
  content = content.replace(/bg-white dark:bg-white dark:bg-slate-900/g, 'bg-white dark:bg-slate-900');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated: ${filePath.replace(SRC_DIR, '')}`);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

console.log('Starting mass Tailwind class refactoring for Light/Dark mode...');
processDirectory(SRC_DIR);
console.log('Finished refactoring.');

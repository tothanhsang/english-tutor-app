import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function extractSection(md, title) {
  const re = new RegExp(`# ${title}[\\s\\S]*?(?=\n# |\n?$)`, 'i');
  const m = md.match(re);
  return m ? m[0] : '';
}

function parseListItems(section) {
  // get lines starting with - or * under the section
  const lines = section.split('\n').slice(1);
  return lines
    .map((l) => l.trim())
    .filter((l) => /^[-*]\s+/.test(l))
    .map((l) => l.replace(/^[-*]\s+/, ''));
}

function parseIA(md) {
  const sec = extractSection(md, 'IA & Pages') || extractSection(md, 'IA and Pages');
  const items = parseListItems(sec);
  // Expect items like: "Landing: hero, features(3), CTA"
  const pages = items.map((raw, idx) => {
    const [namePart, rest = ''] = raw.split(':');
    const name = namePart?.trim() || `Page ${idx + 1}`;
    const route = '/' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const features = rest.split(',').map((s) => s.trim()).filter(Boolean);
    return {
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      name,
      route: name.toLowerCase() === 'landing' ? '/' : route,
      sections: features.map((f, i) => ({ id: `${name.toLowerCase()}_sec_${i+1}`, name: f, components: [] })),
    };
  });
  return pages;
}

function parseDesign(md) {
  const sec = extractSection(md, 'Design Guidelines');
  const items = parseListItems(sec);
  const out = { colors: {}, typography: {}, spacingScale: [] };
  for (const it of items) {
    if (/Color palette/i.test(it)) {
      const mPrimary = it.match(/primary\s*#([0-9a-f]{6})/i);
      const mAccent = it.match(/accent\s*#([0-9a-f]{6})/i);
      if (mPrimary) out.colors.primary = `#${mPrimary[1]}`;
      if (mAccent) out.colors.accent = `#${mAccent[1]}`;
    }
    if (/Typography/i.test(it)) {
      const mHead = it.match(/([A-Za-z0-9\- ]+)\s*\(heading\)/i);
      const mBody = it.match(/([A-Za-z0-9\- ]+)\s*\(body\)/i);
      if (mHead) out.typography.heading = mHead[1].trim();
      if (mBody) out.typography.body = mBody[1].trim();
    }
    if (/Spacing scale/i.test(it)) {
      const nums = it.match(/\d+/g);
      if (nums) out.spacingScale = nums.map((n) => Number(n));
    }
  }
  // defaults
  out.colors.foreground = out.colors.foreground || '#171717';
  out.colors.background = out.colors.background || '#ffffff';
  out.colors.muted = out.colors.muted || '#6b7280';
  return out;
}

function parseProduct(md) {
  const sec = extractSection(md, 'Product Brief');
  const lines = parseListItems(sec);
  const nameLine = lines.find((l) => /^Name\s*:/i.test(l));
  const appName = nameLine ? nameLine.split(':')[1].trim() : 'App';
  return { appName };
}

function comp(type, name, props = {}) {
  return { type, name, props };
}

function enrichPagesWithComponents(pages) {
  for (const p of pages) {
    const lname = p.name.toLowerCase();
    // Ensure sections array exists
    p.sections = p.sections || [];

    if (lname.includes('landing')) {
      // hero, features, CTA
      p.sections.push({ id: `${p.id}_hero`, name: 'Hero', components: [
        comp('Hero', 'Hero Section', { heading: 'Learn English by Q&A', subheading: 'Practice with AI tutor' }),
        comp('Button', 'Primary CTA', { variant: 'primary', label: 'Get Started' })
      ]});
      p.sections.push({ id: `${p.id}_features`, name: 'Features', components: [
        comp('Card', 'Feature 1', { title: 'Topic-based Q&A' }),
        comp('Card', 'Feature 2', { title: 'Progress Tracking' }),
        comp('Card', 'Feature 3', { title: 'Pronunciation (optional)' })
      ]});
      p.sections.push({ id: `${p.id}_cta`, name: 'Call to Action', components: [
        comp('Button', 'Sign Up', { variant: 'accent' })
      ]});
    } else if (lname.includes('auth') || lname.includes('sign')) {
      p.sections.push({ id: `${p.id}_form`, name: 'Auth Form', components: [
        comp('Input', 'Email'),
        comp('Input', 'Password', { type: 'password' }),
        comp('Button', 'Sign In', { variant: 'primary' })
      ]});
    } else if (lname.includes('onboarding')) {
      p.sections.push({ id: `${p.id}_steps`, name: 'Onboarding Steps', components: [
        comp('Select', 'Level', { options: ['A1','A2','B1','B2'] }),
        comp('CheckboxGroup', 'Goals', { options: ['Speaking','Listening','Reading','Writing'] }),
        comp('Select', 'Schedule', { options: ['Daily','3x/week','Weekly'] }),
        comp('Button', 'Continue', { variant: 'primary' })
      ]});
    } else if (lname.includes('dashboard')) {
      p.sections.push({ id: `${p.id}_summary`, name: 'Progress Summary', components: [
        comp('Card', 'Progress Card'),
        comp('Chart', 'Weekly Progress', { type: 'bar' })
      ]});
      p.sections.push({ id: `${p.id}_reco`, name: 'Recommended Lessons', components: [
        comp('Card', 'Lesson Card 1'),
        comp('Card', 'Lesson Card 2'),
        comp('Card', 'Lesson Card 3')
      ]});
    } else if (lname.includes('lesson')) {
      p.sections.push({ id: `${p.id}_chat`, name: 'Q&A Chat', components: [
        comp('Chat', 'Messages'),
        comp('Input', 'Answer Input', { placeholder: 'Type your answer...' }),
        comp('Button', 'Submit', { variant: 'primary' })
      ]});
    } else if (lname.includes('question') || lname.includes('bank')) {
      p.sections.push({ id: `${p.id}_search`, name: 'Search & Filters', components: [
        comp('Input', 'Search'),
        comp('Select', 'Topic'),
        comp('Select', 'Level')
      ]});
      p.sections.push({ id: `${p.id}_list`, name: 'Results List', components: [
        comp('List', 'Questions')
      ]});
    } else if (lname.includes('progress')) {
      p.sections.push({ id: `${p.id}_charts`, name: 'Charts', components: [
        comp('Chart', 'Weekly', { type: 'line' }),
        comp('Chart', 'Monthly', { type: 'bar' })
      ]});
    } else if (lname.includes('settings')) {
      p.sections.push({ id: `${p.id}_settings`, name: 'Settings Form', components: [
        comp('Input', 'Display Name'),
        comp('Select', 'Language', { options: ['English','Vietnamese'] }),
        comp('Switch', 'Email Notifications'),
        comp('Button', 'Save', { variant: 'primary' })
      ]});
    }
  }
  return pages;
}

function main() {
  const specPath = resolve(process.cwd(), 'spec.md');
  const md = readFileSync(specPath, 'utf-8');
  const { appName } = parseProduct(md);
  const tokens = parseDesign(md);
  let pages = parseIA(md);
  pages = enrichPagesWithComponents(pages);
  const result = { appName, tokens, pages };
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

main();

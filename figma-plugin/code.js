// Figma Plugin: Layout JSON Importer
// Imports a layout JSON (schema/schema.layout.json) and generates pages + frames

// --- Utilities ---
function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return { r: 1, g: 1, b: 1 };
  return {
    r: parseInt(m[1], 16) / 255,
    g: parseInt(m[2], 16) / 255,
    b: parseInt(m[3], 16) / 255,
  };
}

function ensureUniqueName(existingNames, base) {
  let name = base;
  let i = 1;
  while (existingNames.has(name)) {
    name = `${base} ${i++}`;
  }
  existingNames.add(name);
  return name;
}

// --- Variables (Tokens) ---
async function createColorVariables(tokens) {
  if (!figma.variables) return null;
  try {
    const collection = figma.variables.createVariableCollection('Design Tokens');
    const lightModeId = figma.variables.addVariableCollectionMode(collection, 'Light');

    const created = {};
    const colorEntries = [
      ['primary', tokens?.colors?.primary],
      ['accent', tokens?.colors?.accent],
      ['foreground', tokens?.colors?.foreground],
      ['background', tokens?.colors?.background],
      ['muted', tokens?.colors?.muted],
    ];

    for (const [name, hex] of colorEntries) {
      if (!hex) continue;
      const v = figma.variables.createVariable(name, collection, 'COLOR');
      const rgb = hexToRgb(hex);
      v.setValueForMode(lightModeId, { r: rgb.r, g: rgb.g, b: rgb.b, a: 1 });
      created[name] = v;
    }
    return { collection, created };
  } catch (e) {
    // If Variables API not available in this environment/version
    return null;
  }
}

function createPageIfMissing(name) {
  const existing = figma.root.children.find((p) => p.name === name);
  if (existing) return existing;
  const page = figma.createPage();
  page.name = name;
  return page;
}

function makeTitle(text, fontSize = 28, color = { r: 0.1, g: 0.1, b: 0.1 }) {
  const node = figma.createText();
  node.characters = text;
  node.fontSize = fontSize;
  node.fills = [{ type: 'SOLID', color }];
  return node;
}

async function ensureFonts() {
  // Load default fonts used in this plugin
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).catch(() => {});
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' }).catch(() => {});
  await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' }).catch(() => {});
}

function setAutoLayout(container) {
  container.layoutMode = 'VERTICAL';
  container.primaryAxisSizingMode = 'AUTO';
  container.counterAxisSizingMode = 'AUTO';
  container.itemSpacing = 16;
  container.paddingTop = 24;
  container.paddingBottom = 24;
  container.paddingLeft = 24;
  container.paddingRight = 24;
  container.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
}

function makeSectionFrame(name) {
  const frame = figma.createFrame();
  frame.name = name;
  setAutoLayout(frame);
  frame.strokes = [{ type: 'SOLID', color: { r: 0.86, g: 0.86, b: 0.86 } }];
  frame.strokeWeight = 1;
  frame.cornerRadius = 8;
  return frame;
}

function makeComponentPlaceholder(name) {
  const rect = figma.createRectangle();
  rect.resize(800, 120);
  rect.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.97, b: 1 } }];
  rect.strokes = [{ type: 'SOLID', color: { r: 0.4, g: 0.6, b: 0.92 } }];
  rect.strokeWeight = 1;
  rect.cornerRadius = 6;
  rect.name = name;
  return rect;
}

async function importLayout(layout) {
  await ensureFonts();

  const appName = layout.appName || 'App';
  const pageNames = new Set(figma.root.children.map((p) => p.name));

  // Create Variables from tokens (colors)
  const vars = await createColorVariables(layout.tokens || {});

  // Create a top-level cover page
  const coverPageName = ensureUniqueName(pageNames, `${appName} – Sitemap & Flows`);
  const coverPage = createPageIfMissing(coverPageName);
  figma.currentPage = coverPage;

  // Add a title on cover
  const title = makeTitle(appName, 36);
  coverPage.appendChild(title);
  title.x = 48;
  title.y = 48;

  // For each page in layout, create a Figma page with a main frame
  for (const page of layout.pages || []) {
    const pageName = page.name || page.id || 'Page';
    const figPage = createPageIfMissing(pageName);

    // Create main container frame
    const main = figma.createFrame();
    main.name = `${pageName} – ${page.route || ''}`.trim();
    main.resize(1440, 1024);
    setAutoLayout(main);

    await figma.loadFontAsync({ family: 'Inter', style: 'Bold' }).catch(() => {});
    const header = makeTitle(pageName, 24);
    main.appendChild(header);

    // Sections
    for (const sec of page.sections || []) {
      const secFrame = makeSectionFrame(sec.name);
      const secLabel = makeTitle(sec.name, 18);
      secFrame.appendChild(secLabel);

      // Components placeholders
      for (const comp of sec.components || []) {
        const placeholder = makeComponentPlaceholder(`${comp.type}: ${comp.name}`);
        secFrame.appendChild(placeholder);
      }

      main.appendChild(secFrame);
    }

    figPage.appendChild(main);
  }
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'import-layout') {
    try {
      const layout = JSON.parse(msg.payload);
      await importLayout(layout);
      figma.notify('Layout imported');
      figma.ui.postMessage({ type: 'done' });
    } catch (e) {
      figma.notify('Failed to import layout: ' + e.message);
      figma.ui.postMessage({ type: 'error', error: String(e) });
    }
  }
  if (msg.type === 'close') {
    figma.closePlugin();
  }
};

figma.showUI(__html__, { width: 420, height: 420 });

import fs from 'fs/promises';

async function loadImports() {
  try {
    const data = await fs.readFile('/assets/imports.json', 'utf-8');
    const config = JSON.parse(data);
    const imports = {};
    for (const importStatement of config.js.imports) {
      const [_, variableName, modulePath] = importStatement.match(/import\s+(.*?)\s+from\s+['"](.*)['"]/);
      imports[variableName] = (await import(modulePath)).default;
    }
    globalThis.dynamicImports = imports;
    config.js.calls.forEach(call => {
      eval(call);
    });
    return imports;
  } catch (error) {
    console.error('Error loading imports:', error);
    return null;
  }
}

(async () => {
  const imports = await loadImports();
  if (imports) {
    console.log('Dynamically imported modules:', imports);

    if (imports.LiteYTEmbed) {
      console.log('LiteYTEmbed is loaded');
    }
  }
})();

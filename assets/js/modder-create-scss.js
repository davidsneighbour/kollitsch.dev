import fs from 'fs/promises';

async function generateScssImports() {
  try {
    const data = await fs.readFile('/assets/imports.json', 'utf-8');
    const config = JSON.parse(data);
    const scssImports = config.scss.imports.map(importPath => `@import '${importPath}';`).join('\n');
    await fs.writeFile('/assets/scss/plugins_generated.scss', scssImports);

    console.log('SCSS imports generated successfully!');
  } catch (error) {
    console.error('Error generating SCSS imports:', error);
  }
}

generateScssImports();

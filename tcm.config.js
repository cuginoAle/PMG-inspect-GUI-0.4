module.exports = {
  // Search for CSS files in the src directory
  searchDir: 'src',

  // Output directory for generated type files
  outDir: 'src',

  // File extensions to process
  extensions: ['.css', '.scss', '.sass'],

  // CSS modules pattern
  cssModules: true,

  // Generate camelCase class names
  camelCase: true,

  // Include CSS variables
  includeCssVariables: true,

  // Watch mode (for development)
  watch: false,

  // Log level
  logLevel: 'info',

  // Custom template for generated types
  template: (cssModuleKeys) => {
    const keys = Object.keys(cssModuleKeys);
    const typeDefinitions = keys.map((key) => `  '${key}': string;`).join('\n');

    return `declare const styles: {
${typeDefinitions}
};

export = styles;
`;
  },
};

/**
 * Utility functions for parsing and replacing Hugo shortcodes in content
 * 
 * Hugo shortcodes come in two forms:
 * 1. {{< shortcode >}} - Regular shortcode
 * 2. {{% shortcode %}} - Shortcode that processes markdown content
 */

/**
 * Find all Hugo shortcodes in a content string
 * @param {string} content - The content to search for shortcodes
 * @returns {Array} - Array of objects with shortcode details
 */
export function findHugoShortcodes(content) {
  const shortcodeRegexes = [
    // Regular shortcodes: {{< shortcode params >}}content{{< /shortcode >}}
    /{{<\s*([a-zA-Z0-9_-]+)([^>}]*?)>}}([\s\S]*?){{<\s*\/\1\s*>}}/g,
    
    // Markdown-processing shortcodes: {{% shortcode params %}}content{{% /shortcode %}}
    /{{\%\s*([a-zA-Z0-9_-]+)([^>}]*?)\%}}([\s\S]*?){{\%\s*\/\1\s*\%}}/g,
    
    // Inline shortcodes with no content: {{< shortcode params >}}
    /{{<\s*([a-zA-Z0-9_-]+)([^>}]*?)>}}/g,
    
    // Inline markdown-processing shortcodes: {{% shortcode params %}}
    /{{\%\s*([a-zA-Z0-9_-]+)([^>}]*?)\%}}/g
  ];
  
  const foundShortcodes = [];
  
  // Search for each type of shortcode
  shortcodeRegexes.forEach((regex, index) => {
    const isMarkdownProcessing = index === 1 || index === 3;
    const hasContent = index === 0 || index === 1;
    
    let match;
    while ((match = regex.exec(content)) !== null) {
      foundShortcodes.push({
        fullMatch: match[0],
        name: match[1],
        params: match[2] ? match[2].trim() : '',
        content: hasContent ? match[3] : '',
        isMarkdownProcessing,
        hasContent,
        position: {
          start: match.index,
          end: match.index + match[0].length
        }
      });
    }
  });
  
  return foundShortcodes;
}

/**
 * Parse the parameters of a shortcode
 * @param {string} paramsString - The parameter string from the shortcode
 * @returns {Object} - Object with parameter names and values
 */
export function parseShortcodeParams(paramsString) {
  const params = {};
  
  // Handle named parameters (key="value" or key='value')
  const namedParamRegex = /([a-zA-Z0-9_-]+)=["']([^"']*)["']/g;
  let namedMatch;
  while ((namedMatch = namedParamRegex.exec(paramsString)) !== null) {
    params[namedMatch[1]] = namedMatch[2];
  }
  
  // Handle positional parameters
  const cleanedParams = paramsString.replace(namedParamRegex, '').trim();
  if (cleanedParams) {
    const positionalParams = cleanedParams.split(/\s+/);
    positionalParams.forEach((param, index) => {
      // Remove quotes if present
      const cleanParam = param.replace(/^["'](.*)["']$/, '$1');
      if (cleanParam) {
        params[index] = cleanParam;
      }
    });
  }
  
  return params;
}

/**
 * Replace Hugo shortcodes with their Astro/React equivalents
 * @param {string} content - Content containing Hugo shortcodes
 * @param {Object} shortcodeMap - Mapping of Hugo shortcode names to replacement functions
 * @returns {string} - Content with shortcodes replaced
 */
export function replaceHugoShortcodes(content, shortcodeMap) {
  const shortcodes = findHugoShortcodes(content);
  
  // Sort shortcodes by position in reverse order to avoid affecting other replacements
  shortcodes.sort((a, b) => b.position.start - a.position.start);
  
  let result = content;
  
  shortcodes.forEach(shortcode => {
    const replacementFn = shortcodeMap[shortcode.name];
    
    if (replacementFn) {
      const params = parseShortcodeParams(shortcode.params);
      const replacement = replacementFn(params, shortcode.content, shortcode.isMarkdownProcessing);
      
      result = 
        result.substring(0, shortcode.position.start) +
        replacement +
        result.substring(shortcode.position.end);
    } else {
      console.warn(`No replacement defined for Hugo shortcode: ${shortcode.name}`);
    }
  });
  
  return result;
}

/**
 * Example shortcode mapping object
 * Define your shortcode replacements here
 */
export const defaultShortcodeMap = {
  // Example: Replace {{< figure src="image.jpg" caption="My Caption" >}} with appropriate HTML
  figure: (params, content) => {
    const src = params.src || '';
    const caption = params.caption || '';
    const alt = params.alt || caption || '';
    const width = params.width || '';
    const height = params.height || '';
    
    return `<figure class="my-6">
      <img src="${src}" alt="${alt}" ${width ? `width="${width}"` : ''} ${height ? `height="${height}"` : ''} class="rounded-lg mx-auto" />
      ${caption ? `<figcaption class="text-center text-gray-500 mt-2">${caption}</figcaption>` : ''}
    </figure>`;
  },
  
  // Example: Replace {{< code >}}console.log("Hello"){{< /code >}} with a code block
  code: (params, content) => {
    const language = params[0] || params.lang || 'plaintext';
    return `<pre class="bg-gray-800 text-white p-4 rounded-lg my-6 overflow-x-auto"><code class="language-${language}">${content}</code></pre>`;
  },
  
  // Example: Replace {{< youtube id="VIDEO_ID" >}} with an embedded YouTube player
  youtube: (params) => {
    const id = params.id || params[0] || '';
    return `<div class="relative my-6 pt-[56.25%]">
      <iframe class="absolute inset-0 w-full h-full rounded-lg" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>`;
  },
  
  // Add more shortcode replacements as needed
};
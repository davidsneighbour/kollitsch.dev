import React from 'react';
import { replaceHugoShortcodes, defaultShortcodeMap } from './shortcodeParser';

/**
 * Component for displaying content that may contain Hugo shortcodes
 * This automatically replaces Hugo shortcodes with their React equivalents
 */
export function HugoContent({ content, customShortcodes = {} }) {
  // Merge the default shortcode map with any custom shortcodes
  const shortcodeMap = { ...defaultShortcodeMap, ...customShortcodes };
  
  // Process the content to replace Hugo shortcodes
  const processedContent = replaceHugoShortcodes(content, shortcodeMap);
  
  // Return the processed content as HTML
  return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
}

/**
 * Example usage:
 * 
 * <HugoContent 
 *   content={`
 *     ## Hello World
 *     
 *     {{< figure src="image.jpg" caption="My Caption" >}}
 *     
 *     {{< code >}}
 *     console.log("Hello World");
 *     {{< /code >}}
 *   `}
 *   customShortcodes={{
 *     // Add any custom shortcode handlers here
 *     myCustomShortcode: (params, content) => {
 *       return `<div class="custom-component">${content}</div>`;
 *     }
 *   }}
 * />
 */
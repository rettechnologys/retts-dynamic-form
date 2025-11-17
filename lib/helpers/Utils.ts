import juice from 'juice';
import { convert } from 'html-to-text';
function InlineHTMLStyle(html: string, css: string) {
  return juice.inlineContent(html, css);
}

function HTMLToWhatsApp(html: string) {
  return convert(html, {
    formatters: {
      em: (elem, walk, builder,) => {
        builder.addInline('_');
        walk(elem.children, builder);
        builder.addInline('_');
      },
      strong: (elem, walk, builder,) => {
        builder.addInline('*');
        walk(elem.children, builder);
        builder.addInline('*');
      },
      s: (elem, walk, builder,) => {
        builder.addInline('~');
        walk(elem.children, builder);
        builder.addInline('~');
      },
      code: (elem, walk, builder,) => {
        builder.addInline('```');
        walk(elem.children, builder);
        builder.addInline('```');
      },
      pre: (elem, walk, builder,) => {
        builder.addInline('```');
        walk(elem.children, builder);
        builder.addInline('```');
      },
    },
    decodeEntities: true,

    selectors: [
      { selector: 'img', format: 'skip' },
      { selector: 'footer', format: 'skip' },
      { selector: 'header', format: 'skip' },
      {
        selector: 'ul',
        options: {
          prefix: '-',
        },
      },
      {
        selector: 'em',
        format: 'em',
        options: {
          prefix: '_',
          suffix: '_',
        },
      },
      {
        selector: 'strong',
        format: 'strong',
        options: {
          prefix: '*',
          suffix: '*',
        },
      },

      {
        selector: 's',
        format: 's',
        options: {
          prefix: '~',
          suffix: '~',
        },
      },
      {
        selector: 'code',
        format: 'code',
        options: {
          prefix: '```',
          suffix: '```',
        },
      },

      {
        selector: 'pre',
        format: 'pre',
        options: {
          prefix: '```',
          suffix: '```',
        },
      },
      {
        selector: 'a',
        options: {
          linkBrackets: false,
        },
      },
      {
        selector: 'hr',
        options: {
          length: 20,
        },
      },
    ],
  });
}

function extractUrlsAndReplace(htmlString: string): {
  urls: string[];
  updatedHtml: string;
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const links = doc.querySelectorAll('a');
  const urls: string[] = [];

  // Iterate through each <a> tag
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      urls.push(href);

      // Replace the <a> tag with its text content
      const textContent = href || '';
      link.replaceWith(textContent);
    }
  });

  // Serialize the updated HTML back into a string
  const updatedHtml = doc.body.innerHTML;

  return { urls, updatedHtml };
}

function TrimHeaderFooterWithStyle(html: string) {
  return html
    .replace(
      /<header class="protected">[\s\S]*?<\/header>|<footer class="protected">[\s\S]*?<\/footer>/g,
      '',
    )
    .replace(/ style="[^"]*"/g, '');
}

export default {
  InlineHTMLStyle,
  HTMLToWhatsApp,
  extractUrlsAndReplace,
  TrimHeaderFooterWithStyle,
};
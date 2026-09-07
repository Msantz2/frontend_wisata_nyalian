/**
 * Article Content Renderer
 * Handles both HTML (from Tiptap editor) and Markdown (legacy articles) formats
 * 
 * Detection logic:
 * - If content starts with '<' and contains HTML tags, treat as HTML
 * - Otherwise, parse as Markdown
 * 
 * HTML content is rendered using dangerouslySetInnerHTML with proper sanitization
 * via the apiSuccess endpoint (content is sanitized server-side before storage)
 */

'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import type { JSX } from 'react';

/**
 * Parse markdown content line-by-line and render as semantic HTML
 * Ensures images are always rendered as separate block-level elements, never inside <p>
 */
function parseMarkdownWithImages(content: string): ReactNode[] {
  const components: ReactNode[] = [];
  const lines = content.split('\n');
  let currentParagraph: string[] = [];
  let componentKey = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for headings (# ## ### etc)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      // Flush current paragraph
      if (currentParagraph.length > 0) {
        components.push(
          <p key={componentKey++} className="text-text-secondary leading-relaxed mb-4">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }

      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      const headingClasses = level === 1 ? 'text-4xl mt-8 mb-4' :
                             level === 2 ? 'text-3xl mt-8 mb-4' :
                             level === 3 ? 'text-2xl mt-6 mb-3' :
                             'text-xl mt-4 mb-2';
      
      components.push(
        <HeadingTag
          key={componentKey++}
          className={`font-heading font-bold text-text-primary ${headingClasses}`}
        >
          {text}
        </HeadingTag>
      );
      continue;
    }

    // Check for unordered list (- or * at start)
    const ulMatch = trimmed.match(/^[\-\*]\s+(.+)$/);
    if (ulMatch) {
      // Flush current paragraph
      if (currentParagraph.length > 0) {
        components.push(
          <p key={componentKey++} className="text-text-secondary leading-relaxed mb-4">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }

      // Collect all list items
      const listItems: string[] = [];
      let i = lines.indexOf(line);
      while (i < lines.length) {
        const listLine = lines[i].trim();
        const itemMatch = listLine.match(/^[\-\*]\s+(.+)$/);
        if (itemMatch) {
          listItems.push(itemMatch[1]);
          i++;
        } else {
          break;
        }
      }

      components.push(
        <ul key={componentKey++} className="list-disc list-inside mb-6 space-y-2">
          {listItems.map((item, idx) => (
            <li key={`list-item-${componentKey}-${idx}`} className="text-text-secondary ml-4">
              {item}
            </li>
          ))}
        </ul>
      );
      
      // Skip processed lines
      const processed = listItems.length;
      for (let j = 0; j < processed - 1; j++) {
        lines.shift();
      }
      continue;
    }

    // Check for blockquote (> at start)
    if (trimmed.startsWith('>')) {
      // Flush current paragraph
      if (currentParagraph.length > 0) {
        components.push(
          <p key={componentKey++} className="text-text-secondary leading-relaxed mb-4">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }

      const quoteText = trimmed.substring(1).trim();
      components.push(
        <blockquote
          key={componentKey++}
          className="border-l-4 border-primary pl-4 italic my-6 text-text-secondary"
        >
          {quoteText}
        </blockquote>
      );
      continue;
    }

    // Check if line contains image markdown ![alt](url)
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const hasImage = imageRegex.test(trimmed);

    if (hasImage) {
      // Flush current paragraph
      if (currentParagraph.length > 0) {
        components.push(
          <p key={componentKey++} className="text-text-secondary leading-relaxed mb-4">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }

      // Extract and render images as separate block elements
      let match;
      imageRegex.lastIndex = 0;
      while ((match = imageRegex.exec(trimmed)) !== null) {
        const [, alt, src] = match;
        if (src && typeof src === 'string') {
          components.push(
            <figure
              key={componentKey++}
              className="relative w-full h-96 my-8 rounded-lg overflow-hidden"
            >
              <Image
                src={src}
                alt={alt || ''}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
                className="object-cover"
              />
            </figure>
          );
        }
      }
    } else if (trimmed === '') {
      // Empty line = paragraph break
      if (currentParagraph.length > 0) {
        components.push(
          <p key={componentKey++} className="text-text-secondary leading-relaxed mb-4">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }
    } else {
      // Regular text line - add to current paragraph
      currentParagraph.push(trimmed);
    }
  }

  // Flush remaining paragraph
  if (currentParagraph.length > 0) {
    components.push(
      <p key={componentKey++} className="text-text-secondary leading-relaxed mb-4">
        {currentParagraph.join(' ')}
      </p>
    );
  }

  return components;
}

/**
 * Detect if content is HTML or Markdown
 */
function isHTML(content: string): boolean {
  // If content starts with < and contains HTML tags, it's HTML
  return content.trim().startsWith('<') && /<[a-z][\s\S]*?>/i.test(content);
}

/**
 * Render HTML content with proper typography styling
 * Per 06-security.md Section 6: Content is sanitized server-side before storage
 */
function renderHTMLContent(html: string): JSX.Element {
  return (
    <div
      className="prose prose-neutral prose-sm max-w-none
        prose-headings:font-heading prose-headings:font-bold prose-headings:text-text-primary
        prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-6
        prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
        prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
        prose-h4:text-xl prose-h4:mt-4 prose-h4:mb-2
        prose-p:text-text-secondary prose-p:leading-relaxed prose-p:mb-4
        prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80
        prose-strong:text-text-primary prose-strong:font-semibold
        prose-em:text-text-secondary prose-em:italic
        prose-ul:list-disc prose-ul:list-inside prose-ul:mb-6 prose-ul:space-y-2
        prose-ol:list-decimal prose-ol:list-inside prose-ol:mb-6 prose-ol:space-y-2
        prose-li:text-text-secondary prose-li:ml-2
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4
        prose-blockquote:italic prose-blockquote:my-6 prose-blockquote:text-text-secondary
        prose-img:rounded-lg prose-img:my-6 prose-img:max-w-full
        prose-hr:my-8 prose-hr:border-gray-200
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function ArticleContentRenderer({ content }: { content: string }): JSX.Element {
  if (isHTML(content)) {
    return renderHTMLContent(content);
  }
  
  // Legacy markdown format
  return (
    <div className="space-y-4">
      {parseMarkdownWithImages(content)}
    </div>
  );
}


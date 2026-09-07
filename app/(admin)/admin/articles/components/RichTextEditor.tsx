'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import CharacterCount from '@tiptap/extension-character-count';
import Underline from '@tiptap/extension-underline';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  onImageUpload: (file: File, type: 'content') => Promise<string>;
  disabled?: boolean;
}

/**
 * Rich Text Editor Component (Tiptap)
 * Per 13-article-editor.md Section 5 and Phase 4.6.1 Improvements
 * Enhanced toolbar with:
 * - Paragraph & Heading styles (H2-H4)
 * - Text formatting: Bold, Italic, Underline, Strikethrough
 * - Lists: Bullet, Ordered
 * - Blockquote, Link, Image, Horizontal Rule
 * - Text Alignment: Left, Center, Right, Justify
 * - Undo/Redo
 */
export function RichTextEditor({
  value,
  onChange,
  onImageUpload,
  disabled = false,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
        link: {
          openOnClick: false,
        },
      }),
      Underline, // Separate extension for underline functionality
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        allowBase64: false,
      }),
      CharacterCount.configure({
        limit: 50000,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
    immediatelyRender: false,
  });

  // Per 13-article-editor.md Section 9: Sync editor content when value prop changes
  // This ensures when loading an existing article, the editor displays the loaded content
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const handleAddLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await onImageUpload(file, 'content');
        editor.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-muted p-2 border-b flex flex-wrap gap-1">
        {/* Undo / Redo */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <RotateCw className="w-4 h-4" />
        </Button>

        <div className="w-px bg-border" />

        {/* Paragraph & Heading Styles */}
        <Button
          size="sm"
          variant={editor.isActive('paragraph') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().setParagraph().run()}
          title="Paragraph"
          className="text-xs font-medium"
        >
          P
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('heading', { level: 4 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          title="Heading 4"
        >
          <Heading4 className="w-4 h-4" />
        </Button>

        <div className="w-px bg-border" />

        {/* Text Formatting */}
        <Button
          size="sm"
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().toggleBold()}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().toggleItalic()}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('underline') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().toggleUnderline()}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('strike') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().toggleStrike()}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </Button>

        <div className="w-px bg-border" />

        {/* Lists */}
        <Button
          size="sm"
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <div className="w-px bg-border" />

        {/* Blockquote */}
        <Button
          size="sm"
          variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </Button>

        <div className="w-px bg-border" />

        {/* Text Alignment */}
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </Button>

        <div className="w-px bg-border" />

        {/* Link */}
        <div className="relative">
          <Button
            size="sm"
            variant={showLinkInput ? 'default' : 'ghost'}
            onClick={() => setShowLinkInput(!showLinkInput)}
            title="Link"
          >
            <LinkIcon className="w-4 h-4" />
          </Button>
          {showLinkInput && (
            <div className="absolute top-full mt-1 left-0 bg-white border rounded shadow-lg p-2 z-50 w-48">
              <input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm mb-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddLink();
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddLink}>
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowLinkInput(false);
                    setLinkUrl('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Image */}
        <label className="inline-block">
          <Button size="sm" variant="ghost" title="Image" asChild>
            <span>
              <ImageIcon className="w-4 h-4" />
            </span>
          </Button>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        <div className="w-px bg-border" />

        {/* Horizontal Rule */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-80 focus:outline-none"
      />

      {/* Character Count - Per Phase 4.6.1 */}
      <div className="bg-muted px-4 py-2 border-t text-xs text-muted-foreground flex justify-end">
        <p>
          {editor.storage.characterCount?.characters?.() || 0} characters
          {editor.storage.characterCount?.words?.() && (
            <>
              {' · '}
              {editor.storage.characterCount.words()} words
            </>
          )}
        </p>
      </div>
    </div>
  );
}

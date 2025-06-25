import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "İçerik yazın...", 
  className 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real implementation, you would initialize TinyMCE or Quill here
    // For now, we'll use a simple contentEditable div
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className={cn("rich-editor border border-input rounded-md", className)}>
      {/* Toolbar */}
      <div className="border-b border-border p-2 flex items-center space-x-2 bg-muted/50">
        <button
          type="button"
          className="p-2 hover:bg-accent rounded text-sm"
          onClick={() => document.execCommand('bold')}
        >
          <LucideIcons.Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-2 hover:bg-accent rounded text-sm"
          onClick={() => document.execCommand('italic')}
        >
          <LucideIcons.Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-2 hover:bg-accent rounded text-sm"
          onClick={() => document.execCommand('underline')}
        >
          <LucideIcons.Underline className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-border" />
        <button
          type="button"
          className="p-2 hover:bg-accent rounded text-sm"
          onClick={() => document.execCommand('justifyLeft')}
        >
          <LucideIcons.AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-2 hover:bg-accent rounded text-sm"
          onClick={() => document.execCommand('justifyCenter')}
        >
          <LucideIcons.AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-2 hover:bg-accent rounded text-sm"
          onClick={() => document.execCommand('justifyRight')}
        >
          <LucideIcons.AlignRight className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-border" />
        <button
          type="button"
          className="p-2 hover:bg-accent rounded text-sm"
          onClick={() => document.execCommand('insertUnorderedList')}
        >
          <LucideIcons.List className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-2 hover:bg-accent rounded text-sm"
          onClick={() => document.execCommand('insertOrderedList')}
        >
          <LucideIcons.ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[250px] outline-none focus:bg-accent/5 border border-input rounded-b-md"
        onInput={handleInput}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
        style={{
          fontSize: '14px',
          lineHeight: '1.5'
        }}
      />
    </div>
  );
}

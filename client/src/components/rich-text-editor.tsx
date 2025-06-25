import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

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
    <div className={cn("rich-editor", className)}>
      {/* Toolbar */}
      <div className="border-b border-border p-2 flex items-center space-x-2 bg-muted/50">
        <button
          type="button"
          className="p-1 hover:bg-accent rounded"
          onClick={() => document.execCommand('bold')}
        >
          <i className="fas fa-bold text-sm" />
        </button>
        <button
          type="button"
          className="p-1 hover:bg-accent rounded"
          onClick={() => document.execCommand('italic')}
        >
          <i className="fas fa-italic text-sm" />
        </button>
        <button
          type="button"
          className="p-1 hover:bg-accent rounded"
          onClick={() => document.execCommand('underline')}
        >
          <i className="fas fa-underline text-sm" />
        </button>
        <div className="w-px h-4 bg-border" />
        <button
          type="button"
          className="p-1 hover:bg-accent rounded"
          onClick={() => document.execCommand('justifyLeft')}
        >
          <i className="fas fa-align-left text-sm" />
        </button>
        <button
          type="button"
          className="p-1 hover:bg-accent rounded"
          onClick={() => document.execCommand('justifyCenter')}
        >
          <i className="fas fa-align-center text-sm" />
        </button>
        <button
          type="button"
          className="p-1 hover:bg-accent rounded"
          onClick={() => document.execCommand('justifyRight')}
        >
          <i className="fas fa-align-right text-sm" />
        </button>
        <div className="w-px h-4 bg-border" />
        <button
          type="button"
          className="p-1 hover:bg-accent rounded"
          onClick={() => document.execCommand('insertUnorderedList')}
        >
          <i className="fas fa-list-ul text-sm" />
        </button>
        <button
          type="button"
          className="p-1 hover:bg-accent rounded"
          onClick={() => document.execCommand('insertOrderedList')}
        >
          <i className="fas fa-list-ol text-sm" />
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[250px] outline-none"
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{
          content: value || placeholder
        }}
      />
    </div>
  );
}

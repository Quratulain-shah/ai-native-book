import React, { useState } from 'react';

interface RichTextEditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialContent, onContentChange }) => {
  const [content, setContent] = useState(initialContent);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    onContentChange(event.target.value);
  };

  return (
    <textarea
      value={content}
      onChange={handleChange}
      style={{ width: '100%', minHeight: '300px', padding: '10px', fontSize: '16px' }}
      placeholder="Start writing your book content here..."
    />
  );
};

export default RichTextEditor;
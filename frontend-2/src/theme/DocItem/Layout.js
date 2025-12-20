import React from 'react';
import OriginalLayout from '@theme-original/DocItem/Layout';
import TextHighlighter from '@site/src/components/ui/TextHighlighter';

export default function DocItem(props) {
  return (
    <TextHighlighter>
      <OriginalLayout {...props} />
    </TextHighlighter>
  );
}
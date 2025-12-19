import React from 'react';
import OriginalDocPage from '@theme-original/DocPage';

const DocPage = (props) => {
  return (
    <div style={{ position: 'relative' }}>
      <OriginalDocPage {...props} />
    </div>
  );
};

export default DocPage;
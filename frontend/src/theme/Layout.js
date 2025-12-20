// src/theme/Layout/index.js
import React from "react";
import OriginalLayout from "@theme-original/Layout";
import SearchBar from "@theme-original/SearchBar";
import { useLocation } from "@docusaurus/router";
import { HighlightProvider } from "@site/src/contexts/HighlightContext";

export default function Layout(props) {
  const location = useLocation();

  // Show search bar only on docs pages, not on navbar or other special pages
  const showSearchBar = location.pathname.startsWith('/docs/');

  return (
    <HighlightProvider>
      <OriginalLayout {...props}>
        {showSearchBar && (
          <div style={{
            maxWidth: 'var(--ifm-container-width)',
            margin: '0 auto',
            padding: '0 var(--ifm-spacing-horizontal)',
          }}>
            <div style={{
              marginBottom: '1.5rem',
              marginTop: '1rem',
            }}>
              <SearchBar />
            </div>
          </div>
        )}
        {props.children}
      </OriginalLayout>
    </HighlightProvider>
  );
}

// src/theme/Layout/index.js
import React from "react";
import OriginalLayout from "@theme-original/Layout";
import { HighlightProvider } from "@site/src/contexts/HighlightContext";

export default function Layout(props) {
  return (
    <HighlightProvider>
      <OriginalLayout {...props} />
    </HighlightProvider>
  );
}

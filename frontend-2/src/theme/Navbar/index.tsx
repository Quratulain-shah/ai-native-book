import React, { useEffect } from 'react';
import Navbar from '@theme-original/Navbar';
import type NavbarType from '@theme/Navbar';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof NavbarType>;

export default function NavbarWrapper(props: Props): React.ReactNode {
  useEffect(() => {
    // Move search element to center after component mounts
    // Only target the main search input/button, not multiple elements
    const searchItems = document.querySelectorAll('.navbar__item[type="search"], .navbar__search, .DocSearch');
    const navbar = document.querySelector('.navbar');

    if (searchItems.length > 0 && navbar) {
      // Only process the first/main search element
      const mainSearchElement = searchItems[0] as HTMLElement;

      // Ensure search item is visible and properly positioned at the top center
      mainSearchElement.style.position = 'absolute';
      mainSearchElement.style.left = '50%';
      mainSearchElement.style.top = '50%';
      mainSearchElement.style.transform = 'translate(-50%, -50%)';
      mainSearchElement.style.zIndex = '1000';
      mainSearchElement.style.display = 'block';

      // Apply robotics-themed styling to match the theme
      mainSearchElement.style.background = 'rgba(10, 10, 10, 0.9)';
      mainSearchElement.style.border = '1px solid rgba(0, 255, 255, 0.5)';
      mainSearchElement.style.borderRadius = '6px';
      mainSearchElement.style.backdropFilter = 'blur(10px)';
      mainSearchElement.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 10px rgba(0, 255, 255, 0.1)';
      mainSearchElement.style.padding = '4px';

      // Hide any additional search elements to prevent duplicates
      for (let i = 1; i < searchItems.length; i++) {
        (searchItems[i] as HTMLElement).style.display = 'none';
      }
    }
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <Navbar {...props} />
    </div>
  );
}

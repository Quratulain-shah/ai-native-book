// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'ui-showcase',
    {
      type: 'category',
      label: 'Introduction',
      items: [
        'intro/introduction',
        'intro/syllabus',
        'intro/hardware-setup',
        'intro/pedagogical-approach'
      ],
    },
  ],
};

module.exports = sidebars;
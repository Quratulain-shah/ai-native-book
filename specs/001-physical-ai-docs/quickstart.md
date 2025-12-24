# Quickstart: Physical AI & Humanoid Robotics Documentation Site

This guide provides the necessary steps to set up the development environment and run the Docusaurus project locally.

## Prerequisites

-   **Node.js**: Version 18.x or later. You can download it from [nodejs.org](https://nodejs.org/).
-   **npm** or **Yarn**: A Node.js package manager. npm is included with Node.js.

## Local Development Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies**:
    This command will install Docusaurus and all other necessary packages defined in `package.json`.
    ```bash
    npm install
    ```
    *or, if you are using Yarn:*
    ```bash
    yarn install
    ```

3.  **Run the development server**:
    This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.
    ```bash
    npm run start
    ```
    *or, with Yarn:*
    ```bash
    yarn start
    ```

By default, the site will be available at `http://localhost:3000`.

## Building the Site

To generate a static production build of the website, run the following command:

```bash
npm run build
```
*or, with Yarn:*
```bash
yarn build
```

This will create a `build` directory with all the static files needed to host the website.

## Content Management

-   All course content is located in the `docs/` directory.
-   Files are written in Markdown (`.md`).
-   The navigation and sidebar structure is managed in the `sidebars.js` file at the project root. To add, remove, or reorder content, you will primarily be editing this file and the files within the `docs/` directory.

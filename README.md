# CleanedIn

A Chrome extension that prioritizes and organizes LinkedIn messages based on content analysis.

## Features

-   Automatically categorize unread LinkedIn messages with custom tags
-   Simple, clean user interface
-   Efficient message scanning through the browser extension

## Installation

1. Clone the repository
2. Install dependencies:

```sh
pnpm install
```

3. Build the extension (production):

```sh
pnpm build
```

4. Load the extension in Chrome:
    - Open Chrome and navigate to `chrome://extensions/`
    - Enable "Developer mode"
    - Click "Load unpacked" and select the `build/chrome-mv3-prod` folder

## Usage

1. Open LinkedIn messaging page
2. Click on the CleanedIn extension icon
3. Add custom tags for message categorization
4. Click "Start Organizing" to begin the process
5. View your messages organized by the categories you defined

## Development

### Development Server

To start the development server with hot reloading:

```sh
pnpm dev
```

This will:

-   Start a local development server
-   Watch for file changes and rebuild automatically
-   Apply changes to the extension without needing to reload it manually

### Other Commands

-   `pnpm build` - Build the extension for production
-   `pnpm clean` - Clean the build directory
-   `pnpm lint` - Check TypeScript code
-   `pnpm prettier` - Format source code

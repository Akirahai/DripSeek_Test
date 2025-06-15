
# Fashion Decoder

Fashion Decoder is an innovative web application designed to help users discover and explore fashion items featured in videos. Leveraging Next.js for the frontend, Tailwind CSS with ShadCN UI for styling, and Google's Genkit for AI-powered fashion analysis, this app offers a unique interactive experience.

## Features

*   **Interactive Video Playback**: Users can load and watch YouTube videos directly within the app.
*   **DripSeek Scene Analysis**: At any point in the video, users can click "DripSeek" to simulate capturing the current scene. The app then (conceptually) analyzes this "frame" to identify fashion keywords.
*   **X-Ray Overlay**: Users can toggle an "X-Ray" overlay on the video, which displays a list of (currently sample) fashion items identified in the scene.
*   **AI Fashion Assistant**:
    *   **Contextual Chat**: Clicking on an item from the DripSeek results or X-Ray overlay opens an AI assistant panel. Users can chat with the AI about the identified items, ask for styling advice, or inquire where to find similar products.
    *   **Image Upload**: Users can upload their own images to the chat to get fashion advice or item identification.
    *   **Shopping Links**: The AI assistant can generate direct search links to e-commerce sites (e.g., Amazon) based on identified fashion keywords.
*   **Fashion Item Exploration**: A dedicated tab in the AI assistant panel allows users to browse and filter a catalog of sample fashion products.

## Tech Stack

*   **Frontend**: Next.js (App Router), React, TypeScript
*   **Styling**: Tailwind CSS, ShadCN UI
*   **AI Integration**: Genkit (with Google AI, e.g., Gemini)
*   **State Management**: React Hooks (useState, useEffect, useContext)
*   **Linting & Formatting**: ESLint, Prettier (implied by Next.js setup)

## Project Structure

A brief overview of the key directories:

*   `src/app/`: Contains the main pages of the application (e.g., `page.tsx` for the homepage) and the root layout (`layout.tsx`).
*   `src/components/`: Houses all reusable React components.
    *   `src/components/ui/`: ShadCN UI components.
    *   Custom components like `Header.tsx`, `Footer.tsx`, `DemoPlayback.tsx`, `AIAssistantPanel.tsx`, `FashionXRayOverlay.tsx`, etc.
*   `src/ai/`: Contains Genkit related code.
    *   `src/ai/flows/`: Defines the Genkit flows for AI functionalities (e.g., `generate-fashion-keywords.ts`, `provide-fashion-assistance.ts`).
    *   `src/ai/genkit.ts`: Genkit global configuration.
*   `src/lib/`: Includes utility functions, type definitions, static data, and server actions.
    *   `actions.ts`: Server-side actions that call Genkit flows.
    *   `static-data.ts`: Sample data for products, featured items, etc.
    *   `types.ts`: TypeScript type definitions.
    *   `utils.ts`: General utility functions (like `cn` for classnames).
*   `src/hooks/`: Custom React hooks (e.g., `useToast.ts`).
*   `public/`: Static assets (though images are often handled by `next/image` or external URLs).
*   `package.json`: Lists project dependencies and scripts.
*   `next.config.ts`: Next.js configuration.
*   `tailwind.config.ts`: Tailwind CSS configuration.
*   `tsconfig.json`: TypeScript configuration.

## Getting Started Locally

Follow these steps to set up and run the Fashion Decoder project on your local machine.

### Prerequisites

*   Node.js (version 18.x or later recommended)
*   npm (usually comes with Node.js)
*   A Google AI API Key (for Genkit features using Gemini).

### 1. Clone the Repository

If you haven't already, clone the project repository to your local machine:

```bash
git clone <your-repository-url>
cd fashion-decoder # Or your project's directory name
```

### 2. Install Dependencies

Install the necessary npm packages:

```bash
npm install
```

### 3. Set Up Environment Variables

The application uses Genkit, which requires a Google AI API key to function.

1.  Create a new file named `.env.local` in the root of your project.
2.  Add your Google AI API key to this file:

    ```env
    GOOGLE_API_KEY=your_google_ai_api_key_here
    ```

    Replace `your_google_ai_api_key_here` with your actual API key.

    **Note**: The `.env.local` file is gitignored by default, so your API key will not be committed to your repository.

### 4. Run the Development Servers

You need to run two development servers simultaneously:
*   The Next.js frontend server.
*   The Genkit development server for AI flows.

**a. Start the Next.js Development Server:**

Open a terminal window and run:

```bash
npm run dev
```

This will typically start the Next.js app on `http://localhost:9002` (as configured in `package.json`).

**b. Start the Genkit Development Server:**

Open a *new* terminal window (keep the Next.js server running) and run:

```bash
npm run genkit:dev
```
or for automatic reloading on changes to AI flows:
```bash
npm run genkit:watch
```

This will start the Genkit development server, usually on `http://localhost:3400`. This server hosts your AI flows and makes them available to the Next.js application. It also provides a Genkit developer UI where you can inspect flows, traces, and configurations.

### 5. Open the Application

Once both servers are running, open your web browser and navigate to `http://localhost:9002` (or the port shown by Next.js).

You should now be able to interact with the Fashion Decoder application!

## Key Scripts

*   `npm run dev`: Starts the Next.js development server (frontend).
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server with file watching for AI flows.
*   `npm run build`: Builds the Next.js application for production.
*   `npm run start`: Starts the Next.js production server (after building).
*   `npm run lint`: Lints the codebase.
*   `npm run typecheck`: Runs TypeScript type checking.

Enjoy exploring and developing Fashion Decoder!

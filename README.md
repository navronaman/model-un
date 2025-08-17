# Model UN Session Tracker

A React-based web application for Model UN committee chairs to manage and track committee sessions in real-time.

## Features

- **Session Setup**: Configure delegates and their details
- **Motion Management**: Propose and vote on different types of motions
- **Timer System**: Track speaking times and caucus durations
- **Delegate Tracking**: Maintain voting and speaking history for each delegate

## Tech Stack

- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local development URL.

## Project Structure

```
src/
├── components/          # React components
│   ├── SetupScreen.tsx  # Session setup interface
│   └── index.ts        # Component exports
├── types/              # TypeScript type definitions
│   └── index.ts        # Application interfaces
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

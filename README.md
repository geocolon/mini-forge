# Mini Forge — Production Dashboard Prototype

A React/TypeScript prototype simulating Anduril's ArsenalOS Forge production management interface, built with the same technology stack and architectural patterns observed in Anduril's [sample-app-entity-visualizer](https://github.com/anduril/sample-app-entity-visualizer).

## Architecture

This project mirrors the entity visualizer's architecture:

- **`ProductionStore`** (modeled after `EntityStore`) — A class-based store that manages mutable production data internally and exposes snapshot methods for React to poll. In a real Forge implementation, the internal `setInterval` would be replaced with a gRPC stream via ConnectRPC.

- **Polling pattern** (same as `App.tsx` in entity visualizer) — React reads from the store every 3 seconds using `setInterval`, spreading values into state to trigger re-renders. This decouples high-frequency data updates from React's render cycle.

- **Flat project structure** — Minimal folder hierarchy. Types, store, and components each have a clear role without over-abstraction.

## Tech Stack

| Tool | Purpose | Anduril Match |
|------|---------|---------------|
| React 18 | UI framework | Same |
| TypeScript | Type safety | Same |
| Vite | Build tool | Same |
| Material UI | Component library | Same |
| Recharts | Data visualization | Similar (Anduril uses various charting) |

## Running Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 to view the dashboard.

## Features

- Real-time production line monitoring (Roadrunner, Fury, Altius-600, Ghost X)
- Interactive line pause/resume controls
- Quality rate tracking with threshold indicators
- Throughput chart showing units/hr over 12 hours
- Live production event log with typed events
- Summary metric cards

## Why This Exists

Built as an interview preparation project for the Senior Software Engineer, Full Stack role on Anduril's ArsenalOS team. Demonstrates familiarity with Anduril's tech stack, architectural patterns, and the manufacturing domain that Forge serves.

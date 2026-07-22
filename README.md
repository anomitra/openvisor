# OpenVisor

Go under the hood of your OpenCode sessions. Zero telemetry. Full clarity.

OpenVisor is a client-only web app for browsing OpenCode session exports — messages, tool calls, reasoning chains, token usage, and cost. Everything stays in your browser. No backend, no tracking, no servers.

## Features

- **Drop a JSON export** — drag and drop your OpenCode `export.json` or click to browse.
- **Session library** — imported sessions are stored locally in your browser's IndexedDB.
- **Message timeline** — chronological view of user and assistant messages.
- **Tool call inspection** — expandable cards for bash, read, write, edit, glob, task, question, and more.
- **Reasoning chains** — view model reasoning with signature badges and duration.
- **Token & cost breakdown** — per-session usage and estimated cost summaries.
- **Privacy-first** — all data stays client-side. No uploads, no cookies, no analytics.

## Tech Stack

- [Next.js](https://nextjs.org/) 16 with App Router
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Dexie.js](https://dexie.org/) for IndexedDB storage
- [Lucide React](https://lucide.dev/) icons
- [react-markdown](https://github.com/remarkjs/react-markdown) + [rehype-highlight](https://github.com/rehypejs/rehype-highlight) for rendered content

## Getting Started

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and drop your OpenCode `export.json`.

A sample export is included at `app/public/export.json` so you can click **View a sample** on the home page.

## Build for Production

```bash
cd app
npm run build
```

The static export is configured in `next.config.ts`. Output goes to `app/out/`.

## Deployment

OpenVisor is configured for static hosting on Netlify via `netlify.toml`:

- Build base: `app`
- Build command: `npm run build`
- Publish directory: `out`
- Node version: `22`

You can also deploy the `out/` directory to any static host.

## Project Structure

```
app/
  src/
    app/              # Next.js app router, layout, and global styles
    components/       # React components
    lib/              # IndexedDB layer, session context, utilities
    types/            # TypeScript type definitions
  public/             # Static assets, including sample export.json
  next.config.ts
  package.json
  tsconfig.json
```

## Privacy & Security

OpenVisor processes everything inside the browser. Session exports are parsed with `JSON.parse` and stored in IndexedDB. No data is sent to any server. No API keys are required.

## License

[MIT](LICENSE) © 2026 Anomitra

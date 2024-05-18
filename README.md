<h1>
 🎧 Search podcasts with voice, powered by Typesense
</h1>
This is a demo that showcase <a href="https://typesense.org/docs/26.0/api/voice-search-query.html" target="_blank">Typesense's Voice Query feature</a>.

## Tech Stack

- <a href="https://github.com/typesense/typesense" target="_blank">Typesense</a>
- <a href="https://github.com/facebook/react" target="_blank">React</a> + <a href="https://github.com/vitejs/vite" target="_blank">Vite</a>
- Typescript
- Tailwind + shadcn/ui

The dataset contains metadata of 96K podcasts (after being filtered) and is from <a href="https://www.kaggle.com/datasets/listennotes/all-podcast-episodes-published-in-december-2017" target="_blank">Listen Notes</a>.

This demo uses <a href="https://github.com/muaz-khan/RecordRTC" target="_blank">RecordRTC</a> to record audio and <a href="https://github.com/otalk/hark" target="_blank">hark</a> for silence detection.

## Project Structure

```bash
├── scripts/
│   ├── data/
│   │   └── podcasts-1000-samples.jsonl
│   └── indexTypesense.ts # script that index data from podcasts-1000-samples.jsonl into typesense server
└── src/
    ├── components/
    │   └── UI components...
    ├── hooks/
    │   └── useSearch.tsx
    ├── lib/
    │   └── typesense.ts # typesense client config
    └── App.tsx # podcasts search
```

## Development

To run this project locally, make sure you have docker and nodejs, install dependencies and start the dev server:

Start typesense server

```shell
npm run start:typesense # or: docker compose up
```

Index data into typesense

```shell
npm run index:typesense
```

Start the dev server

```shell
npm run dev
```

Open http://localhost:5173 to see the app ✌️

## Environment

Set env variables in `.env` file to point the app to the Typesense Cluster

```env
VITE_TYPESENSE_SEARCH_ONLY_API_KEY=xxx
VITE_TYPESENSE_URL=https://xxxxxxx.typesense.net:443
```

Only for indexing:

```env
TYPESENSE_ADMIN_API_KEY=xyz
```

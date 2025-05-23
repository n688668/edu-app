# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# Firebase CLI

To host your site with Firebase Hosting, you need the Firebase CLI (a command line tool).
```bash
npm install -g firebase-tools
```

Deploy to Firebase Hosting

```bash
firebase login
firebase init
firebase deploy
```

# firebase.json default site redirect to kidskids site
```
firebase deploy --only hosting:nuxtabc

{
  "firestore": {
    "database": "(default)",
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": ".output/public",
    "redirects": [
      {
        "source": "/**",
        "destination": "https://kidskids.web.app",
        "type": 301
      }
    ],
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

# Fork
```
https://chatgpt.com/c/682fec25-e1ec-8007-ab10-c47a97e4b2df
```

# Taskfin

Taskfin is a simple to-do list app that helps you prioritize tasks and hides tasks that are not important at the moment. 

## Getting Started

Before you start using the app, populate the .env file, it should look something like this:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="YOUR SECRET"
```

If using the app for the first time, you need to build it. To do that run:
```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

Once the app is built it can be run with:
```bash
npm run start
# or
yarn start
# or
pnpm start
# or
bun start
```

You can also open the developer environment with:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
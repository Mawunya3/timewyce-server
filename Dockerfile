FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* ./
RUN corepack enable && (pnpm -v >/dev/null 2>&1 && pnpm install --frozen-lockfile) || npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]

FROM node:lts-alpine

WORKDIR /app
COPY package.json pnpm-lock.yaml .
RUN corepack enable pnpm && pnpm i --frozen-lockfile

COPY . . 

EXPOSE 3000

CMD ["pnpm", "dev"]
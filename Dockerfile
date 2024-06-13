FROM oven/bun:latest

WORKDIR /app

COPY package*.json bun.lockb ./

RUN bun install

COPY client ./client

RUN bun run client:install
RUN bun run client:build

COPY . .

ARG PORT
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["bun", "run", "server:start"]
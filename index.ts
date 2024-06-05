import app from "./server/app"

const server = Bun.serve({
  port: Bun.env.PORT!,
  fetch: app.fetch
})

console.log(`Listening on http://localhost:${server.port}`)

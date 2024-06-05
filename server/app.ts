import { Hono } from "hono"
import { serveStatic } from "hono/bun"
import redis from "./lib/redis"

redis.connect()
const app = new Hono()

app.onError((err, c) => {
  return c.json({
    message: "Internal server error",
  }, 500)
})

app.get("/api/search", async (c) => {
  const start = performance.now()

  const query = c.req.query("q")?.toUpperCase()

  if (!query)
    return c.json(
      {
        message: "No query provided"
      },
      400
    )

  const results = []
  const rank = await redis.zRank("terms", query)

  if (rank !== null && rank !== undefined) {
    const temp = await redis.zRange("terms", rank, rank + 100)

    for (const el of temp) {
      if (!el.startsWith(query)) break

      if (el.endsWith("*")) {
        results.push(el.substring(0, el.length - 1))
      }
    }
  }

  const end = performance.now()

  return c.json({
    results: results,
    duration: end - start
  })
})

app.get("*", serveStatic({ root: "./client/dist" }))
app.get("*", serveStatic({ path: "./client/dist/index.html" }))

export default app

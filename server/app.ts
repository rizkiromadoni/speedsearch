import { Redis } from "@upstash/redis"
import { Hono } from "hono"
import { env } from "hono/adapter"

const app = new Hono()

type EnvConfig = {
  UPSTASH_REDIS_REST_TOKEN: string
  UPSTASH_REDIS_REST_URL: string
}

app.get("/api/search", async (c) => {
  try {
    const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } =
      env<EnvConfig>(c)

    const start = performance.now()

    const redis = new Redis({
      url: UPSTASH_REDIS_REST_URL,
      token: UPSTASH_REDIS_REST_TOKEN
    })

    const query = c.req.query("q")?.toUpperCase()

    if (!query)
      return c.json(
        {
          message: "No query provided"
        },
        400
      )

    const results = []
    const rank = await redis.zrank("terms", query)

    if (rank !== null && rank !== undefined) {
      const temp = await redis.zrange<string[]>("terms", rank, rank + 100)

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
  } catch (error) {
    console.error(error)
    return c.json({
        results: [],
        message: "Something went wrong"
    }, 500)
  }
})

export default app

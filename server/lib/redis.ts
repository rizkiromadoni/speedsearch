import { createClient } from 'redis'

const redis = createClient({
    url: Bun.env.REDIS_URL!
})
.on("error", (err) => console.log("Redis Client Error", err))
.on("connect", () => console.log("Redis Client Connected"))


export default redis
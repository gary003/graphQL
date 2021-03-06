const http = require("http")
const app = require("../app").app

const PORT = 4000

const server = http.createServer(app)

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`))

server.on("error", () => {
  process.exit(1)
})

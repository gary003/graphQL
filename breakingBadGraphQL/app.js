const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const schema = require("./schema/schema")
const PORT = 8080

const app = express()

app.use(
  "/graphiql",
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
)

app.listen(PORT, () => console.log(`Listen on port : ${PORT}`))

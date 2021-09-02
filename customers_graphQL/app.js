const express = require("express")
const cors = require("cors")
const { graphqlHTTP } = require("express-graphql")

const schema = require("./schema.js")

const app = express()

app.use(cors())

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
)

module.exports.app = app

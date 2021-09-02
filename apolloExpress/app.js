const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const axios = require('axios')
// The GraphQL schema
const typeDefs = gql`
  type Post {
    userId: ID!,
    id: Int!,
    title: String!,
    body: String!
  }

  type Query {
    "A simple type for getting started!"
    posts: [Post]
  }

  type Mutation {
    addPost(userId:ID,title:String,body:String): Post
  }
`

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    posts: () => {
      return axios.get('https://jsonplaceholder.typicode.com/posts?_limit=15')
                  .then(res => {
                    // console.log(res);
                    return res.data
                  })
                  .catch(err => console.log(err))
    },
  },
  Mutation: {
    addPost: (_, args) => {
      console.log(`${_}`)
      return axios.post('https://jsonplaceholder.typicode.com/posts',args)
                  .then(res => {
                    // console.log(res);
                    return res.data
                  })
                  .catch(err => console.log(err))
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const app = express()

server.applyMiddleware({app})

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)

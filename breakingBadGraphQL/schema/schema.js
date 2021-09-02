const axios = require("axios")
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = require("graphql")

const EpisodeType = new GraphQLObjectType({
  name: "EpisodeType",
  fields: () => {
    return {
      episode_id: { type: GraphQLInt },
      title: { type: GraphQLString },
      season: { type: GraphQLInt },
      episode: { type: GraphQLInt },
      air_date: { type: GraphQLString },
      characters: {
        type: new GraphQLList(CharacterType),
        async resolve(parent, args) {
          const result = await axios.get("https://www.breakingbadapi.com/api/characters").catch((err) => console.log(err))
          return result.data.filter((c) => parent.characters.includes(c.name))
        }
      }
    }
  }
})

const CharacterType = new GraphQLObjectType({
  name: "CharacterType",
  fields: () => ({
    char_id: { type: GraphQLInt },
    name: { type: GraphQLString },
    birthday: { type: GraphQLString },
    occupation: { type: new GraphQLList(GraphQLString) },
    img: { type: GraphQLString },
    status: { type: GraphQLString },
    appearance: { type: new GraphQLList(GraphQLInt) },
    nickname: { type: GraphQLString },
    portrayed: { type: GraphQLString }
  })
})

const query = new GraphQLObjectType({
  name: "query",
  fields: () => ({
    characters: {
      type: new GraphQLList(CharacterType),
      resolve: () => {
        return axios
          .get("https://www.breakingbadapi.com/api/characters")
          .then((res) => res.data)
          .catch((err) => console.log(err))
      }
    },
    character: {
      type: CharacterType,
      args: { id: { type: GraphQLInt } },
      resolve: (parent, args) => {
        return axios
          .get(`https://www.breakingbadapi.com/api/characters/${args.id}`)
          .then((res) => res.data[0])
          .catch((err) => console.log(err))
      }
    },
    episodes: {
      type: new GraphQLList(EpisodeType),
      resolve: () => {
        return axios
          .get("https://www.breakingbadapi.com/api/episodes")
          .then((res) => res.data)
          .catch((err) => console.log(err))
      }
    },
    episode: {
      type: EpisodeType,
      args: { episode_id: { type: GraphQLInt } },
      resolve: (parent, args) => {
        return axios
          .get(`https://www.breakingbadapi.com/api/episodes/${args.episode_id}`)
          .then((res) => res.data[0])
          .catch((err) => console.log(err))
      }
    }
  })
})

module.exports = new GraphQLSchema({
  query
})

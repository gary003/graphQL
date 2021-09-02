const axios = require("axios")

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLSchema } = require("graphql")

const Address = new GraphQLObjectType({
  name: "Address",
  fields: () => ({
    id: { type: GraphQLString },
    customerId: { type: GraphQLString },
    country: { type: GraphQLString },
    textAddress: { type: GraphQLString }
  })
})

const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
    deliveryAddress: {
      type: new GraphQLList(Address),
      resolve: async (parentValue) => {
        const allAddresses = await axios.get("http://localhost:3000/addresses").catch((e) => console.log(e))
        return allAddresses.data.filter((a) => a.customerId == parentValue.id)
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: async (parentValue, args) => {
        const res = await axios.get(`http://localhost:3000/customers/${args.id}`).catch((err) => console.error(err))
        return res.data
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve: async () => {
        const res = await axios.get(`http://localhost:3000/customers`).catch((err) => console.error(err.message))
        return res.data
      }
    },
    address: {
      type: Address,
      args: {
        id: { type: GraphQLString }
      },
      resolve: async (parentValue, args) => {
        console.log(args)
        const res = await axios.get(`http://localhost:3000/addresses/${args.id}`).catch((err) => console.error(err.message))
        console.log(res)
        return res.data
      }
    },
    addresses: {
      type: new GraphQLList(Address),
      resolve: async () => {
        const res = await axios.get(`http://localhost:3000/addresses`).catch((err) => console.error(err.message))
        return res.data
      }
    }
  })
})

const mutation = new GraphQLObjectType({
  name: "mutation",
  fields: () => ({
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parentValue, args) {
        return axios
          .post(`http://localhost:3000/customers/`, {
            name: args.name,
            email: args.email,
            age: args.age
          })
          .then((res) => res.data)
          .catch((err) => console.error(err))
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parentValue, args) => {
        await axios.delete(`http://localhost:3000/customers/${args.id}/`).catch((err) => console.error(err))
        return args
      }
    },
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        return axios
          .patch(`http://localhost:3000/customers/${args.id}`, args)
          .then((res) => res.data)
          .catch((err) => console.error(err))
      }
    },
    addAddress: {
      type: Address,
      args: {
        customerId: { type: new GraphQLNonNull(GraphQLString) },
        country: { type: new GraphQLNonNull(GraphQLString) },
        textAddress: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parentValue, args) => {
        const res = await axios.post("http://localhost:3000/addresses", args).catch((err) => console.error(err))
        return res.data
      }
    }
  })
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation
})

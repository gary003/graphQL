const assert = require('chai').assert
const axios = require('axios')
const superAgent = require('superagent')

let customerTestId = null

describe('graphQL requests', async() => {
describe('GET', async() => {
it('should return an array', async() => {

      const data = {
        query: `query GetCustomers{
                  customers {
                              name,
                              email,
                              id
                            }
                          }`
      }

      const result = await superAgent.get('http://localhost:4000/graphql', data).catch(error => console.error(error))
      assert.isArray(result.body.data.customers)
    })

}),
describe('POST', async() => {
it('should add a new customer', async() => {

      const result = await axios({
        url: 'http://localhost:4000/graphql',
        method: 'post',
        data: {
          query: `mutation AC{
            addCustomer(
                name: "Tanya Slowski",
                age: 32,
                email: "TS@outlook.com",
            ){
                name,
                id
            }
          }`
        }
      }).catch(error => console.error(error.message))

      // console.log(result);
      customerTestId = result.data.data.addCustomer.id
      assert.isString(result.data.data.addCustomer.id)
    })

}),
describe('POST2', async() => {
it('should add a new adress', async() => {
const result2 = await axios({
url: 'http://localhost:4000/graphql',
method: 'post',
data: {
query: `mutation addAdress($customerId: String!){ addAdress( customerId: $customerId, country: "Poland", textAdress: "12 yau uiek Warsaw", ){ customerId, id } }`,
operationName: 'addAdress',
variables: {
customerId: customerTestId
}
}
}).catch(error => console.error(error.data))
assert.isString(result2.data.data.addAdress.id)
})
}),
describe('DELETE', async() => {
it('should get a user and delete it', async () => {
const result = await axios({
url: 'http://localhost:4000/graphql/',
method: 'post',
data:{
query: `mutation deleteCustomer($id: String!){ deleteCustomer(id: $id){ id } }`,
operationName: 'deleteCustomer',
variables: {
id: customerTestId
}
}
}).catch(err => console.error(err))
// console.log({ customerTestId })

      assert.isString(result.data.data.deleteCustomer.id)
    })

})
},10000)

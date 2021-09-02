const assert = require("chai").assert
const request = require("supertest")
const app = require("../app").app

let customerTestId = null

describe("graphQL tests", () => {
  describe("GET", () => {
    it("should return an array", (done) => {
      return request(app)
        .post("/graphql")
        .send({
          query: "{ customers { name, email, id, deliveryAddress { country } } }"
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .end((err, result) => {
          // console.log(result.body.data.customers)
          if (!!err) return done(err)
          assert.isArray(result.body.data.customers)
          done()
        })
    })
  })

  describe("POST", () => {
    it("should add a new customer", (done) => {
      return request(app)
        .post("/graphql")
        .send({
          query: `mutation AC{ 
                    addCustomer( name: "Tanya Slowski", age: 32, email: "TS@outlook.com"){ name, id } 
                  }`
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .end((err, result) => {
          // console.log(result.body.data)
          if (!!err) return done(err)
          customerTestId = result.body.data.addCustomer.id
          assert.isNotNull(result.body.data.addCustomer.id)
          done()
        })
    })
  })

  describe("POST2", () => {
    it("should add a new adress", (done) => {
      // console.log(customerTestId)
      return request(app)
        .post("/graphql")
        .send({
          query: `mutation addAddress($customerId: String!){ 
                    addAddress( customerId: $customerId, country: "Poland", textAddress: "12 yau uiek Warsaw"){ customerId,id } 
                  }`,
          operationName: "addAddress",
          variables: {
            customerId: customerTestId
          }
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .end((err, result) => {
          // console.log(result.body)
          if (!!err) return done(err)
          assert.isNotNull(result.body.data.addAddress.id)
          done()
        })
    })
  })

  describe("DELETE", () => {
    it("should get a user and delete it", (done) => {
      // console.log(customerTestId)
      return request(app)
        .post("/graphql")
        .send({
          query: `mutation deleteCustomer($id: String!){
                    deleteCustomer(id: $id){ id }
                  }`,
          operationName: "deleteCustomer",
          variables: {
            id: customerTestId
          }
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .end((err, result) => {
          // console.log(result.body)
          if (!!err) return done(err)
          assert.isNotNull(result.body.data.deleteCustomer.id)
          done()
        })
    })
  })
})

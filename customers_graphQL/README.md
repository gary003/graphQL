# Description

This is an implementation of the basics of graphQL.

# Pre-requisite

You have to have those instaled on your system.

- npm (v6+)
- nodejs (v14+)
  you can download those softwares here : https://nodejs.org/en/
- git

# Download

Project available on github.
https://github.com/gary003/customer_graphQL.git

## Installation

After getting the project from github.

```bash
cd customer_graphQL
npm install
npm start
```

You should be able to reach the graphiql interface on any browser at : http://localhost:4000/graphql.

# Tests

To test the project, only the fake bdd(json-server) should be on.
So, stop the current execution of both servers' ( app and json-server)

```bash
ctrl C on the servers terminal
npm run dev:json
npm run test:mocha
```

You should see the tests and test coverage.

## Team

Gary Johnson <gary.johnson.freelance@gmail.com> developer

## License

[MIT](https://choosealicense.com/licenses/mit/)

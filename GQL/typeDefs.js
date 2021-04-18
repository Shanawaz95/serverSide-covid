const { gql } = require("apollo-server");

module.exports = gql`
  type Query {
    getFilters: Filters!
    getData(filters: FiltersIn): [Data]
  }

  type Data {
    _id: String
    active: Int!
    recovered: Int!
    deceased: Int!
    others: Int!
  }

  type out {
    status: String
    count: Int
  }

  input FiltersIn {
    location: String
    gender: String
    age: String
    status: String
    from: String
    to: String
  }

  type Filters {
    location: [String!]!
    gender: [String!]!
    age: [String!]!
    status: [String!]!
    dates: [String!]!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    userName: String!
    createdAt: String!
  }

  input RegisterInput {
    userName: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
  }
`;

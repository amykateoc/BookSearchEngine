const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {
    me: User
    getSingleUser: User
  }
  
  type Mutation {
    login(email: String!, password: String!): Auth
    createUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: SaveBookInput!): User
    deleteBook(bookId: ID!): User
  }
  
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int!
    savedBooks: [Book!]
  }
  
  type Book {
    bookId: ID!
    authors: [String!]
    description: String!
    title: String!
    image: String
    link: String
  }
  
  type Auth {
    token: String!
    user: User!
  }
  
  input SaveBookInput {
    authors: [String!]
    description: String!
    title: String!
    bookId: ID!
    image: String
    link: String
  }  
  `;

  module.exports = typeDefs;
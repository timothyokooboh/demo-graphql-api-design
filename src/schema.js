import gql from "graphql-tag";

export const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String
    author: String
    created_at: String
    updated_at: String
  }

  type User {
    id: ID!
    email: String!
    created_at: String!
    token: String!
  }

  input PostFilterInput {
    id: ID
    author: String
  }

  input PostCreateInput {
    title: String!
    content: String!
    author: String!
  }

  input PostUpdateInput {
    id: ID!
    title: String
    content: String
    author: String
  }

  input UserCreateInput {
    email: String!
    password: String!
  }

  type Query {
    posts: [Post]
    post(input: PostFilterInput): Post
  }

  type Mutation {
    createPost(input: PostCreateInput!): Post!
    updatePost(input: PostUpdateInput!): Post!
    signUp(input: UserCreateInput): User!
    signIn(input: UserCreateInput): User!
  }

  type Subscription {
    postCreated: Post!
  }
`;

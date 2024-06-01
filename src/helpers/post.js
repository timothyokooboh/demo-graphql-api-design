import { pubsub } from "../index.js";
import { POST_CREATED } from "../resolvers.js";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";

export const createPost = async (_, { input }, { user, prisma }) => {
  const post = await prisma.post.create({
    data: {
      ...input,
    },
  });

  await pubsub.publish(POST_CREATED, { postCreated: post });
  return post;
};

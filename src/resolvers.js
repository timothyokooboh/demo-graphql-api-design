import {
  createJwt,
  hashPassword,
  isAuthenticated,
  signIn,
} from "./helpers/auth.js";
import { createPost } from "./helpers/post.js";
import { pubsub } from "./index.js";
export const POST_CREATED = "POST_CREATED";

export const resolvers = {
  Query: {
    async post(_, { input }, { prisma }) {
      const post = await prisma.post.findFirst({
        where: {
          author: input.author,
        },
      });

      return post;
    },
    async posts(_, {}, { prisma }) {
      const posts = await prisma.post.findMany();
      return posts;
    },
  },
  Mutation: {
    async signUp(_, { input }, { prisma }) {
      try {
        const hashedPassword = await hashPassword(input.password);

        const user = await prisma.user.create({
          data: {
            ...input,
            password: hashedPassword,
          },
        });

        const token = createJwt(user);

        console.log({
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          token,
        });

        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          token,
        };
      } catch (err) {
        throw err;
      }
    },
    signIn: signIn,
    createPost: isAuthenticated(createPost),
    async updatePost(_, { input }) {
      const post = await prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });

      return post;
    },
  },
  Subscription: {
    postCreated: {
      subscribe() {
        return pubsub.asyncIterator([POST_CREATED]);
      },
    },
  },
};

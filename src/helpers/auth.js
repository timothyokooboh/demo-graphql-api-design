import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

export const hashPassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

export const createJwt = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET
  );

  return token;
};

export const verifyPassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const getUserFromToken = (token) => {
  if (!token) return null;

  const user = jwt.verify(token, process.env.JWT_SECRET);
  return user || null;
};

export const isAuthenticated = (next) => (root, args, context, info) => {
  if (!context.user) {
    throw new GraphQLError("You need to sign in", {
      extensions: {
        code: "FORBIDDEN",
        requiredArgs: ["email", "password"],
      },
    });
  }

  return next(root, args, context, info);
};

export const isAuthorized = (role, next) => (root, args, context, info) => {
  if (context.user.role !== role) {
    throw new Error("Not authorized");
  }
  return next(root, args, context, info);
};

export const signIn = async (_, { input }, { prisma }) => {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await verifyPassword(input.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = createJwt(user);

  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    token,
  };
};

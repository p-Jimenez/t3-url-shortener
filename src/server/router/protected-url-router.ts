import { createProtectedRouter } from "./protected-router";
import { z } from "zod";

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedUrlRouter = createProtectedRouter()
  .query("getSecretMessage", {
    resolve({ ctx }) {
      return "He who asks a question is a fool for five minutes; he who does not ask a question remains a fool forever.";
    },
  })
  .mutation("saveUrl", {
    input: z.object({
      url: z.string().min(1),
      slug: z.string().min(1),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.url.create({
        data: {
          url: input.url,
          slug: input.slug,
          userId: ctx.session.user.id
        }
      });
    }
  });


import { createRouter } from "./context";
import { z } from "zod";

export const urlRouter = createRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.url.findMany();
    },
  })
  .query("getBySlug", {
    input: z.object({
      slug: z.string().min(1)
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.url.findUniqueOrThrow({
        where: {
          slug: input.slug,
        },
      });
    }
  })
  .query("getBySlugFilter", {
    input: z.object({
      slug: z.string().min(1),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.url.findMany({
        // slug contains input.slug
        where: {
          slug: {
            contains: input.slug,
          }
        }
      });
    }
  });

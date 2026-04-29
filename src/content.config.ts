import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const artworks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/artworks" }),
  schema: z.object({
    title: z.string(),
    titlePt: z.string(),
    description: z.string().max(160),
    descriptionPt: z.string().max(160),
    publishedAt: z.coerce.date(),
    cover: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    images: z.array(
      z.object({
        src: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      }),
    ),
    tags: z.array(z.string()),
    technique: z.string().optional(),
    dimensions: z.string().optional(),
    year: z.number().int().optional(),
    featured: z.boolean().optional().default(false),
    shop: z
      .object({
        available: z.boolean(),
        price: z.number().optional(),
        stock: z.number().int().optional(),
        sku: z.string().optional(),
      })
      .optional(),
    mosaic: z.array(
      z.object({
        imageIndex: z.number().int(),
        colStart: z.number().int().min(1).max(12),
        colSpan: z.number().int().min(1).max(12),
        rowSpan: z.number().int().optional(),
      }),
    ),
  }),
});

export const collections = { artworks };

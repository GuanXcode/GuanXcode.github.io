import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.coerce.date(),
    author: z.string().default('GuanXcode'),
    tags: z.array(z.string()),
    headerImg: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    role: z.string().optional(),
    url: z.string().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    start: z.string(),
    end: z.string().optional(),
    location: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    type: z.enum(['demo', 'design', 'talk', 'article', 'repo', 'other']).default('other'),
    url: z.string().optional(),
    image: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { blog, projects, experience, works };

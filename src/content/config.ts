import { defineCollection, z } from "astro:content";

const posts = defineCollection({
	type: "content",
	schema: z.object({
		// RSS generation depends on these fields being present and non-empty.
		title: z.string().trim().min(1),
		description: z.string().trim().min(1),
		pubDate: z.coerce.date(),
		categories: z.array(z.string().trim().min(1)).min(1),
		author: z.string().trim().min(1),
		authorEmail: z.string().email(),
		image: z.union([z.string().url(), z.string().startsWith("/"), z.literal("")]),
	}),
});

const projects = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		semver: z.string(),
		github: z.string(),
		projectUrl: z.string().url(),
		latestReleaseUrl: z.string().url(),
		featured: z.number().int().optional(),
	}),
});

export const collections = { posts, projects };

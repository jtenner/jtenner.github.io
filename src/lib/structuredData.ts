export type CanonicalUrlSource = URL | string;

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonLdPayload = { [key: string]: JsonValue };

const cleanValue = <T>(value: T): T | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? (trimmed as unknown as T) : undefined;
  }
  if (typeof value === "number" || typeof value === "boolean") return value;

  if (Array.isArray(value)) {
    const items = value
      .map((item) => cleanValue(item))
      .filter((item) => item !== undefined);
    return items.length > 0 ? (items as unknown as T) : undefined;
  }

  if (typeof value === "object") {
    const out: { [key: string]: JsonValue } = {};
    for (const [key, nested] of Object.entries(value)) {
      const cleaned = cleanValue(nested as JsonValue);
      if (cleaned !== undefined) {
        out[key] = cleaned;
      }
    }
    return Object.keys(out).length > 0 ? (out as unknown as T) : undefined;
  }

  return undefined;
};

export const toCanonicalUrl = (
  path: string,
  site: CanonicalUrlSource,
): string => {
  const siteUrl = typeof site === "string" ? new URL(site) : site;
  const safePath = path.startsWith("http") ? path : path.startsWith("/")
    ? path
    : `/${path}`;
  return new URL(safePath, siteUrl).toString();
};

export const toJsonLd = (value: JsonValue): string => {
  const cleaned = cleanValue(value);
  if (!cleaned) return "{}";
  return JSON.stringify(cleaned).replace(/</g, "\\u003c");
};

export interface PublisherSeed {
  type: "Person" | "Organization";
  name: string;
  image?: string;
  logo?: string;
  sameAs?: string[];
}

export interface BlogIdentityConfig {
  siteName: string;
  publisher: PublisherSeed;
}

export interface PostSummary {
  slug: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    author: string;
    image: string;
    categories: string[];
  };
}

export const BLOG_IDENTITY: BlogIdentityConfig = {
  siteName: "Assembling Me",
  publisher: {
    type: "Person",
    name: "Joshua Tenner",
  },
};

export interface PublisherSchemaInput {
  site: CanonicalUrlSource;
  publisher: PublisherSeed;
}

export const buildPublisherSchema = ({
  site,
  publisher,
}: PublisherSchemaInput): JsonLdPayload => {
  return {
    "@type": publisher.type,
    name: publisher.name,
    url: toCanonicalUrl("/", site),
    image: publisher.image,
    logo: publisher.logo,
    sameAs: publisher.sameAs,
  };
};

export interface WebsiteSchemaInput {
  site: CanonicalUrlSource;
  name: string;
  description?: string;
  publisher: PublisherSeed;
}

export const buildWebsiteSchema = ({
  site,
  name,
  description,
  publisher,
}: WebsiteSchemaInput): JsonLdPayload => {
  return cleanValue({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: toCanonicalUrl("/", site),
    description,
    publisher: buildPublisherSchema({ site, publisher }),
  }) as JsonLdPayload;
};

export interface PostItemListInput {
  site: CanonicalUrlSource;
  visiblePosts: PostSummary[];
}

export const buildHomepageItemListSchema = ({
  site,
  visiblePosts,
}: PostItemListInput): JsonLdPayload | undefined => {
  if (visiblePosts.length === 0) return undefined;

  return cleanValue({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Latest posts",
    numberOfItems: visiblePosts.length,
    itemListElement: visiblePosts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "BlogPosting",
        "@id": toCanonicalUrl(`/posts/${post.slug}`, site),
        url: toCanonicalUrl(`/posts/${post.slug}`, site),
        name: post.data.title,
      },
    })),
  }) as JsonLdPayload | undefined;
};

const toIsoDate = (value: string | Date): string =>
  value instanceof Date ? value.toISOString() : new Date(value).toISOString();

export interface BlogPostingSchemaInput {
  site: CanonicalUrlSource;
  post: PostSummary;
  publisher: PublisherSeed;
}

export const buildBlogPostingSchema = ({
  site,
  post,
  publisher,
}: BlogPostingSchemaInput): JsonLdPayload | undefined => {
  const published = toIsoDate(post.data.pubDate);
  if (!published) return undefined;

  return cleanValue({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.data.title,
    description: post.data.description,
    url: toCanonicalUrl(`/posts/${post.slug}`, site),
    mainEntityOfPage: toCanonicalUrl(`/posts/${post.slug}`, site),
    datePublished: published,
    dateModified: undefined,
    author: post.data.author
      ? {
          "@type": "Person",
          name: post.data.author,
        }
      : undefined,
    publisher: buildPublisherSchema({ site, publisher }),
    image: post.data.image,
    inLanguage: "en",
    keywords: post.data.categories?.length
      ? post.data.categories.join(", ")
      : undefined,
    articleSection: post.data.categories?.[0],
  }) as JsonLdPayload | undefined;
};

export interface BreadcrumbInput {
  site: CanonicalUrlSource;
  postTitle: string;
  postSlug: string;
}

export const buildBreadcrumbListSchema = ({
  site,
  postTitle,
  postSlug,
}: BreadcrumbInput): JsonLdPayload | undefined => {
  const postUrl = toCanonicalUrl(`/posts/${postSlug}`, site);
  const homeUrl = toCanonicalUrl("/", site);

  return cleanValue({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: postTitle,
        item: postUrl,
      },
    ],
  }) as JsonLdPayload | undefined;
};

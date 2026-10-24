import type { ImageMetadata } from 'astro';
import { createClient } from '@sanity/client';
import seed from '../../seed/content.json';

// --- Content shape (shared by the Sanity query and seed/content.json) -------

export type LocalImage = { kind: 'local'; src: ImageMetadata; alt: string };
export type SanityImage = {
  kind: 'sanity';
  source: { asset: { _ref: string }; crop?: unknown; hotspot?: unknown };
  width: number;
  height: number;
  alt: string;
};
export type SiteImage = LocalImage | SanityImage;

export type Link = { label: string; href: string };
export type Social = { platform: 'linkedin' | 'medium' | 'twitter'; url: string };
export type Item = { title: string; description: string };
export type Quote = { quote: string; attribution: string };
export type Cta = { ctaLabel: string; ctaHref: string };
export type Seo = { seoTitle: string; seoDescription: string };

export type SiteSettings = {
  title: string;
  description: string;
  email: string;
  location: string;
  googleTagId?: string;
  navigation: Link[];
  socialLinks: Social[];
  contact: { heading: string; subheading: string; body: string; image: SiteImage };
};

export type HomePage = Seo & {
  hero: Cta & { heading: string; body: string; image: SiteImage };
  logos: SiteImage[];
  about: { heading: string; tagline: string; body: string };
  certifications: SiteImage[];
  skills: Cta & { heading: string; items: Item[] };
  featuredQuote: Quote;
  experience: Cta & { heading: string; logos: SiteImage[] };
  recommendations: Cta & { heading: string; items: Quote[] };
};

export type AboutPage = Seo & {
  hero: Cta & { heading: string; tagline: string; intro: string; image: SiteImage };
  experience: { heading: string; items: Item[]; linkLabel: string; linkHref: string };
  quote: Quote;
  hobbies: { heading: string; items: (Item & { icon: string })[] };
  closingQuote: Quote;
};

export type Book = { title: string; author: string; url: string; description: string; cover: SiteImage };
export type BookshelfPage = Seo & { heading: string; intro: string; books: Book[] };

export type SiteContent = {
  settings: SiteSettings;
  home: HomePage;
  about: AboutPage;
  bookshelf: BookshelfPage;
};

// --- Sanity -----------------------------------------------------------------

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

export const sanityConfig = projectId ? { projectId, dataset } : null;

const IMG = `{ ..., "dimensions": asset->metadata.dimensions }`;
const QUERY = `{
  "settings": *[_id == "siteSettings"][0]{ ..., contact{ ..., image${IMG} } },
  "home": *[_id == "homePage"][0]{
    ..., hero{ ..., image${IMG} }, logos[]${IMG}, certifications[]${IMG}, experience{ ..., logos[]${IMG} }
  },
  "about": *[_id == "aboutPage"][0]{ ..., hero{ ..., image${IMG} } },
  "bookshelf": *[_id == "bookshelfPage"][0]{
    ..., books[]->{ title, author, url, description, cover${IMG} }
  }
}`;

async function fromSanity(config: { projectId: string; dataset: string }): Promise<SiteContent> {
  const client = createClient({ ...config, apiVersion: '2026-10-01', useCdn: false, perspective: 'published' });
  const data = await client.fetch(QUERY);
  for (const key of ['settings', 'home', 'about', 'bookshelf'] as const) {
    if (!data[key]) {
      throw new Error(`Sanity document for "${key}" is missing in ${config.projectId}/${config.dataset}. Run the seed import in studio/ (see README).`);
    }
  }
  return mapImages(data, (img) => {
    // Editors can crop (hotspot is enabled); size attributes must match the cropped output.
    const { width = 1200, height = 1200 } = img.dimensions ?? {};
    const c = img.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
    return {
      kind: 'sanity',
      source: img,
      width: Math.round(width * (1 - c.left - c.right)),
      height: Math.round(height * (1 - c.top - c.bottom)),
      alt: img.alt ?? '',
    };
  });
}

// --- Seed fallback (used until a Sanity project is configured) ---------------

const seedImages = import.meta.glob<{ default: ImageMetadata }>('/seed/images/*');

async function fromSeed(): Promise<SiteContent> {
  const pending: Promise<void>[] = [];
  const data = mapImages(structuredClone(seed), (img) => {
    const loader = seedImages[`/seed/images/${img.file}`];
    if (!loader) throw new Error(`seed/content.json references missing image: ${img.file}`);
    const out = { kind: 'local', alt: img.alt ?? '' } as LocalImage;
    pending.push(loader().then((m) => void (out.src = m.default)));
    return out;
  });
  await Promise.all(pending);
  return data as SiteContent;
}

// Walks the content tree and replaces every image object (Sanity `_type: 'image'`
// or seed `{ file }`) with a normalized SiteImage.
function mapImages(node: any, fn: (img: any) => SiteImage): any {
  if (Array.isArray(node)) return node.map((n) => mapImages(n, fn));
  if (node && typeof node === 'object') {
    if (node._type === 'image' || typeof node.file === 'string') return fn(node);
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, mapImages(v, fn)]));
  }
  return node;
}

let cached: Promise<SiteContent> | undefined;

export function getContent(): Promise<SiteContent> {
  cached ??= sanityConfig ? fromSanity(sanityConfig) : fromSeed();
  return cached;
}

export const paragraphs = (text = '') => text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

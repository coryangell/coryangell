// Converts ../seed/content.json (the migrated WordPress content) into a Sanity
// NDJSON import file with local image assets: studio/seed-import/content.ndjson
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const seed = JSON.parse(readFileSync(resolve(root, 'seed/content.json'), 'utf8'));
const outDir = resolve(root, 'studio/seed-import');

let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36).padStart(4, '0')}`;

// Image `{ file, alt }` -> Sanity image with a local asset; array items get `_key`s.
function convert(node) {
  if (Array.isArray(node)) {
    return node.map((n) => {
      const v = convert(n);
      return v && typeof v === 'object' ? { _key: key(), ...v } : v;
    });
  }
  if (node && typeof node === 'object') {
    if (typeof node.file === 'string') {
      const abs = resolve(root, 'seed/images', node.file);
      if (!existsSync(abs)) throw new Error(`Missing image: ${abs}`);
      const img = { _type: 'image', _sanityAsset: `image@${pathToFileURL(abs).href}` };
      return node.alt ? { ...img, alt: node.alt } : img;
    }
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, convert(v)]));
  }
  return node;
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const books = seed.bookshelf.books.map((b) => ({ _id: `book-${slug(b.title)}`, _type: 'book', ...convert(b) }));

const docs = [
  { _id: 'siteSettings', _type: 'siteSettings', ...convert(seed.settings) },
  { _id: 'homePage', _type: 'homePage', ...convert(seed.home) },
  { _id: 'aboutPage', _type: 'aboutPage', ...convert(seed.about) },
  {
    _id: 'bookshelfPage',
    _type: 'bookshelfPage',
    ...convert({ ...seed.bookshelf, books: undefined }),
    books: books.map((b) => ({ _key: key(), _type: 'reference', _ref: b._id })),
  },
  ...books,
];

// Arrays of objects need a `_type` on each member for Sanity's array UI.
// `items` arrays are typed by the field that contains them (hobbies.items -> hobby).
const memberType = (arrayKey, parentKey) =>
  ({ navigation: 'navLink', socialLinks: 'socialLink' })[arrayKey] ??
  (arrayKey === 'items' ? ({ hobbies: 'hobby', recommendations: 'quote' })[parentKey] ?? 'item' : undefined);

function typeMembers(node, key, parentKey) {
  if (Array.isArray(node)) {
    for (const m of node) {
      if (m && typeof m === 'object' && !m._type) m._type = memberType(key, parentKey);
      typeMembers(m);
    }
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) typeMembers(v, k, key);
  }
  return node;
}

mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'content.ndjson'), docs.map((d) => JSON.stringify(typeMembers(d))).join('\n') + '\n');
console.log(`Wrote ${docs.length} documents to studio/seed-import/content.ndjson`);

import { defineField, defineType } from 'sanity';

export const item = defineType({
  name: 'item',
  title: 'Item',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
  ],
});

export const hobby = defineType({
  name: 'hobby',
  title: 'Hobby',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      type: 'string',
      description: 'Font Awesome 6 solid icon name, e.g. "guitar" (see fontawesome.com/icons).',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
  ],
});

export const quote = defineType({
  name: 'quote',
  title: 'Quote',
  type: 'object',
  fields: [
    defineField({ name: 'quote', type: 'text', rows: 5, validation: (r) => r.required() }),
    defineField({ name: 'attribution', type: 'string' }),
  ],
  preview: { select: { title: 'attribution', subtitle: 'quote' } },
});

export const navLink = defineType({
  name: 'navLink',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'href', type: 'string', description: 'Path ("/about/"), anchor ("#contact"), or full URL.', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
});

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      type: 'string',
      options: { list: ['linkedin', 'medium', 'twitter'] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'url', type: 'url', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'platform', subtitle: 'url' } },
});

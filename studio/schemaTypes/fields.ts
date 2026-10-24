import { defineArrayMember, defineField } from 'sanity';

export const imageField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', description: 'Describe the image for screen readers.' })],
  });

export const imageArray = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'image',
        fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
      }),
    ],
  });

export const text = (name: string, title: string, rows = 4, description?: string) =>
  defineField({ name, title, type: 'text', rows, description });

export const string = (name: string, title: string) => defineField({ name, title, type: 'string' });

export const cta = [string('ctaLabel', 'Button label'), string('ctaHref', 'Button link')];

export const seoFields = [
  defineField({ name: 'seoTitle', title: 'SEO title', type: 'string', group: 'seo' }),
  defineField({ name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3, group: 'seo' }),
];

export const groups = [
  { name: 'content', title: 'Content', default: true },
  { name: 'seo', title: 'SEO' },
];

export const PARAGRAPHS = 'Separate paragraphs with a blank line.';

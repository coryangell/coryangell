import { defineArrayMember, defineField, defineType } from 'sanity';
import { cta, groups, imageArray, imageField, PARAGRAPHS, seoFields, string, text } from './fields';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups,
  fields: [
    ...seoFields,
    defineField({
      name: 'hero',
      type: 'object',
      group: 'content',
      fields: [string('heading', 'Heading'), text('body', 'Body', 4, PARAGRAPHS), ...cta, imageField('image', 'Image')],
    }),
    { ...imageArray('logos', 'Logo strip (under hero)'), group: 'content' },
    defineField({
      name: 'about',
      type: 'object',
      group: 'content',
      fields: [string('heading', 'Heading'), string('tagline', 'Tagline'), text('body', 'Body', 8, PARAGRAPHS)],
    }),
    { ...imageArray('certifications', 'Certification badges'), group: 'content' },
    defineField({
      name: 'skills',
      type: 'object',
      group: 'content',
      fields: [string('heading', 'Heading'), defineField({ name: 'items', type: 'array', of: [defineArrayMember({ type: 'item' })] }), ...cta],
    }),
    defineField({ name: 'featuredQuote', title: 'Featured quote', type: 'quote', group: 'content' }),
    defineField({
      name: 'experience',
      type: 'object',
      group: 'content',
      fields: [string('heading', 'Heading'), imageArray('logos', 'Logos (white, on dark background)'), ...cta],
    }),
    defineField({
      name: 'recommendations',
      type: 'object',
      group: 'content',
      fields: [string('heading', 'Heading'), defineField({ name: 'items', type: 'array', of: [defineArrayMember({ type: 'quote' })] }), ...cta],
    }),
  ],
  preview: { prepare: () => ({ title: 'Home page' }) },
});

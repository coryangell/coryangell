import { defineArrayMember, defineField, defineType } from 'sanity';
import { cta, groups, imageField, seoFields, string, text } from './fields';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  groups,
  fields: [
    ...seoFields,
    defineField({
      name: 'hero',
      type: 'object',
      group: 'content',
      fields: [string('heading', 'Heading'), string('tagline', 'Tagline'), text('intro', 'Intro', 4), imageField('image', 'Image'), ...cta],
    }),
    defineField({
      name: 'experience',
      type: 'object',
      group: 'content',
      fields: [
        string('heading', 'Heading'),
        defineField({ name: 'items', type: 'array', of: [defineArrayMember({ type: 'item' })] }),
        string('linkLabel', 'Link label'),
        string('linkHref', 'Link URL'),
      ],
    }),
    defineField({ name: 'quote', type: 'quote', group: 'content' }),
    defineField({
      name: 'hobbies',
      type: 'object',
      group: 'content',
      fields: [string('heading', 'Heading'), defineField({ name: 'items', type: 'array', of: [defineArrayMember({ type: 'hobby' })] })],
    }),
    defineField({ name: 'closingQuote', title: 'Closing quote', type: 'quote', group: 'content' }),
  ],
  preview: { prepare: () => ({ title: 'About page' }) },
});

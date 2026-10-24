import { defineArrayMember, defineField, defineType } from 'sanity';
import { groups, PARAGRAPHS, seoFields, string, text } from './fields';

export const bookshelfPage = defineType({
  name: 'bookshelfPage',
  title: 'Bookshelf page',
  type: 'document',
  groups,
  fields: [
    ...seoFields,
    { ...string('heading', 'Heading'), group: 'content' },
    { ...text('intro', 'Intro', 6, PARAGRAPHS), group: 'content' },
    defineField({
      name: 'books',
      description: 'Drag to reorder. Create new books under "Books".',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'book' }] })],
    }),
  ],
  preview: { prepare: () => ({ title: 'Bookshelf page' }) },
});

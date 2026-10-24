import { defineField, defineType } from 'sanity';
import { imageField } from './fields';

export const book = defineType({
  name: 'book',
  title: 'Book',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'author', type: 'string' }),
    { ...imageField('cover', 'Cover'), validation: (r) => r.required() },
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({ name: 'url', title: 'Link (e.g. Amazon)', type: 'url' }),
  ],
  preview: { select: { title: 'title', subtitle: 'author', media: 'cover' } },
});

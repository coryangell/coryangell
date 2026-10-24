import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageField, PARAGRAPHS, string, text } from './fields';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Site name', type: 'string', validation: (r) => r.required() }),
    text('description', 'Default meta description', 3),
    defineField({ name: 'email', type: 'string', validation: (r) => r.required().email() }),
    string('location', 'Location'),
    defineField({ name: 'googleTagId', title: 'Google tag ID', type: 'string', description: 'e.g. G-XXXX or GT-XXXX. Leave empty to disable analytics.' }),
    defineField({ name: 'navigation', type: 'array', of: [defineArrayMember({ type: 'navLink' })] }),
    defineField({ name: 'socialLinks', title: 'Social links', type: 'array', of: [defineArrayMember({ type: 'socialLink' })] }),
    defineField({
      name: 'contact',
      title: 'Contact section (shown on every page)',
      type: 'object',
      fields: [string('heading', 'Heading'), string('subheading', 'Subheading'), text('body', 'Body', 4, PARAGRAPHS), imageField('image', 'Image')],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});

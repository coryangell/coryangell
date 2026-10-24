import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes, singletonTypes } from './schemaTypes';

const singletons = [
  { id: 'siteSettings', title: 'Site settings' },
  { id: 'homePage', title: 'Home page' },
  { id: 'aboutPage', title: 'About page' },
  { id: 'bookshelfPage', title: 'Bookshelf page' },
];

export default defineConfig({
  name: 'default',
  title: 'Cory Angell',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            ...singletons.map(({ id, title }) =>
              S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id)),
            ),
            S.divider(),
            S.documentTypeListItem('book').title('Books'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "New document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.includes(schemaType)),
  },

  document: {
    // Singletons can only be edited and published, never duplicated or deleted.
    actions: (actions, { schemaType }) =>
      singletonTypes.includes(schemaType)
        ? actions.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
});

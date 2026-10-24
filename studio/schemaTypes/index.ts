import { aboutPage } from './aboutPage';
import { book } from './book';
import { bookshelfPage } from './bookshelfPage';
import { homePage } from './homePage';
import { hobby, item, navLink, quote, socialLink } from './objects';
import { siteSettings } from './siteSettings';

export const singletonTypes = ['siteSettings', 'homePage', 'aboutPage', 'bookshelfPage'];

export const schemaTypes = [siteSettings, homePage, aboutPage, bookshelfPage, book, item, hobby, quote, navLink, socialLink];

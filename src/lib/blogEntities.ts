import { Entity } from 'electrodb'
import { docClient, CONTENT_TABLE } from './db'

const table = CONTENT_TABLE

export const BlogAuthor = new Entity(
  {
    model: { entity: 'blogAuthor', version: '1', service: 'plexoContent' },
    attributes: {
      id: { type: 'string', required: true },
      templateId: { type: 'string', required: true },
      userId: { type: 'string' },
      name: { type: 'string', required: true },
      slug: { type: 'string', required: true },
      avatarUrl: { type: 'string' },
      bio: { type: 'string' },
      createdAt: { type: 'string', default: () => new Date().toISOString(), readOnly: true },
      updatedAt: { type: 'string', default: () => new Date().toISOString(), watch: '*', set: () => new Date().toISOString() },
    },
    indexes: {
      primary: {
        pk: { field: 'pk', composite: ['templateId'], template: 'TEMPLATE#${templateId}' },
        sk: { field: 'sk', composite: ['slug'], template: 'AUTHOR#${slug}' },
      },
      byUser: {
        index: 'GSI1',
        pk: { field: 'GSI1PK', composite: ['userId'], template: 'USER#${userId}' },
        sk: { field: 'GSI1SK', composite: ['templateId'], template: 'AUTHOR#${templateId}' },
      },
    },
  },
  { table, client: docClient },
)

export const BlogCategory = new Entity(
  {
    model: { entity: 'blogCategory', version: '1', service: 'plexoContent' },
    attributes: {
      id: { type: 'string', required: true },
      templateId: { type: 'string', required: true },
      name: { type: 'string', required: true },
      slug: { type: 'string', required: true },
      description: { type: 'string' },
      parentId: { type: 'string' },
      createdAt: { type: 'string', default: () => new Date().toISOString(), readOnly: true },
    },
    indexes: {
      primary: {
        pk: { field: 'pk', composite: ['templateId'], template: 'TEMPLATE#${templateId}' },
        sk: { field: 'sk', composite: ['slug'], template: 'CATEGORY#${slug}' },
      },
      byParent: {
        index: 'GSI1',
        pk: { field: 'GSI1PK', composite: ['parentId'], template: 'CATPARENT#${parentId}' },
        sk: { field: 'GSI1SK', composite: ['id'], template: 'CATEGORY#${id}' },
      },
    },
  },
  { table, client: docClient },
)

export const BlogTag = new Entity(
  {
    model: { entity: 'blogTag', version: '1', service: 'plexoContent' },
    attributes: {
      id: { type: 'string', required: true },
      templateId: { type: 'string', required: true },
      name: { type: 'string', required: true },
      slug: { type: 'string', required: true },
      createdAt: { type: 'string', default: () => new Date().toISOString(), readOnly: true },
    },
    indexes: {
      primary: {
        pk: { field: 'pk', composite: ['templateId'], template: 'TEMPLATE#${templateId}' },
        sk: { field: 'sk', composite: ['slug'], template: 'TAG#${slug}' },
      },
    },
  },
  { table, client: docClient },
)

export const BlogPost = new Entity(
  {
    model: { entity: 'blogPost', version: '1', service: 'plexoContent' },
    attributes: {
      id: { type: 'string', required: true },
      templateId: { type: 'string', required: true },
      authorId: { type: 'string' },
      title: { type: 'string', required: true },
      slug: { type: 'string', required: true },
      excerpt: { type: 'string' },
      contentJson: { type: 'any', required: true },
      contentHtml: { type: 'string', required: true },
      featuredImageUrl: { type: 'string' },
      featuredImageAlt: { type: 'string' },
      status: { type: ['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'] as const, default: 'DRAFT' },
      publishedAt: { type: 'string' },
      scheduledAt: { type: 'string' },
      metaTitle: { type: 'string' },
      metaDescription: { type: 'string' },
      ogImageUrl: { type: 'string' },
      noindex: { type: 'boolean', default: false },
      readingTimeMinutes: { type: 'number' },
      viewCount: { type: 'number', default: 0 },
      externalId: { type: 'string' },
      commentsEnabled: { type: 'boolean', default: true },
      createdAt: { type: 'string', default: () => new Date().toISOString(), readOnly: true },
      updatedAt: { type: 'string', default: () => new Date().toISOString(), watch: '*', set: () => new Date().toISOString() },
    },
    indexes: {
      primary: {
        pk: { field: 'pk', composite: ['templateId'], template: 'TEMPLATE#${templateId}' },
        sk: { field: 'sk', composite: ['slug'], template: 'POST#${slug}' },
      },
      byStatus: {
        index: 'GSI1',
        pk: { field: 'GSI1PK', composite: ['templateId'], template: 'TEMPLATEPOSTS#${templateId}' },
        sk: { field: 'GSI1SK', composite: ['status', 'publishedAt', 'id'], template: '${status}#${publishedAt}#${id}' },
      },
    },
  },
  { table, client: docClient },
)

export const BlogPostCategory = new Entity(
  {
    model: { entity: 'blogPostCategory', version: '1', service: 'plexoContent' },
    attributes: {
      templateId: { type: 'string', required: true },
      postId: { type: 'string', required: true },
      categoryId: { type: 'string', required: true },
    },
    indexes: {
      primary: {
        pk: { field: 'pk', composite: ['templateId'], template: 'TEMPLATE#${templateId}' },
        sk: { field: 'sk', composite: ['postId', 'categoryId'], template: 'POSTCAT#${postId}#${categoryId}' },
      },
      byCategory: {
        index: 'GSI1',
        pk: { field: 'GSI1PK', composite: ['categoryId'], template: 'CATEGORY#${categoryId}' },
        sk: { field: 'GSI1SK', composite: ['postId'], template: 'POST#${postId}' },
      },
    },
  },
  { table, client: docClient },
)

export const BlogPostTag = new Entity(
  {
    model: { entity: 'blogPostTag', version: '1', service: 'plexoContent' },
    attributes: {
      templateId: { type: 'string', required: true },
      postId: { type: 'string', required: true },
      tagId: { type: 'string', required: true },
    },
    indexes: {
      primary: {
        pk: { field: 'pk', composite: ['templateId'], template: 'TEMPLATE#${templateId}' },
        sk: { field: 'sk', composite: ['postId', 'tagId'], template: 'POSTTAG#${postId}#${tagId}' },
      },
      byTag: {
        index: 'GSI1',
        pk: { field: 'GSI1PK', composite: ['tagId'], template: 'TAG#${tagId}' },
        sk: { field: 'GSI1SK', composite: ['postId'], template: 'POST#${postId}' },
      },
    },
  },
  { table, client: docClient },
)

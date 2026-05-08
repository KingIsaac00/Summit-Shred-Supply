import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  ListingStatus: a.enum(['ACTIVE', 'SOLD', 'HIDDEN']),
  ListingCondition: a.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']),

  Listing: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      price: a.integer().required(),
      category: a.string().required(),
      condition: a.ref('ListingCondition').required(),
      imageUrls: a.string().array(),
      sellerSub: a.string().required(),
      sellerName: a.string(),
      sellerEmail: a.email(),
      location: a.string(),
      status: a.ref('ListingStatus').required(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  Conversation: a
    .model({
      listingId: a.id().required(),
      listingTitle: a.string().required(),
      buyerSub: a.string().required(),
      buyerName: a.string(),
      sellerSub: a.string().required(),
      sellerName: a.string(),
      participantIds: a.string().array().required(),
      lastMessagePreview: a.string(),
      lastMessageAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.ownersDefinedIn('participantIds').identityClaim('sub'),
    ]),

  Message: a
    .model({
      conversationId: a.id().required(),
      listingId: a.id().required(),
      senderSub: a.string().required(),
      senderName: a.string(),
      recipientSub: a.string().required(),
      body: a.string().required(),
      participantIds: a.string().array().required(),
      readAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.ownersDefinedIn('participantIds').identityClaim('sub'),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

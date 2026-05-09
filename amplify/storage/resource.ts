import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'summitShredUploads',
  access: (allow) => ({
    'listing-images/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'profile-images/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  }),
});

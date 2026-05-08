import { Amplify } from 'https://esm.sh/@aws-amplify/core@6.16.2';
import {
  cognitoCredentialsProvider,
  cognitoUserPoolsTokenProvider,
  fetchUserAttributes,
  getCurrentUser,
} from 'https://esm.sh/@aws-amplify/auth@6.19.1/cognito?deps=@aws-amplify/core@6.16.2';
import { generateClient } from 'https://esm.sh/@aws-amplify/api@6.3.25?deps=@aws-amplify/core@6.16.2';

const CONFIG_PATHS = ['/amplify_outputs.json', '/amplifyconfiguration.json'];

let client = null;
let readyPromise = null;

async function loadConfig() {
  for (const path of CONFIG_PATHS) {
    try {
      const response = await fetch(path, { cache: 'no-store' });
      if (response.ok) return normalizeConfig(await response.json());
    } catch {
      // Try the next known Amplify config filename.
    }
  }

  throw new Error('Missing Amplify config.');
}

function normalizeConfig(config) {
  if (config.Auth?.Cognito?.userPoolId && config.API?.GraphQL?.endpoint) return config;

  const auth = config.auth || {};
  const data = config.data || {};

  return {
    ...config,
    Auth: {
      Cognito: {
        userPoolId: auth.user_pool_id,
        userPoolClientId: auth.user_pool_client_id,
        identityPoolId: auth.identity_pool_id,
        allowGuestAccess: auth.unauthenticated_identities_enabled,
        loginWith: {
          email: auth.username_attributes?.includes('email') ?? true,
          phone: auth.username_attributes?.includes('phone_number') ?? false,
          username: auth.username_attributes?.includes('username') ?? false,
        },
      },
    },
    API: {
      GraphQL: {
        endpoint: data.url,
        region: data.aws_region,
        defaultAuthMode: 'userPool',
        modelIntrospection: data.model_introspection,
      },
    },
  };
}

async function ensureReady() {
  if (readyPromise) return readyPromise;

  readyPromise = (async () => {
    const config = await loadConfig();
    cognitoUserPoolsTokenProvider.setAuthConfig(config.Auth);
    Amplify.configure(config, {
      Auth: {
        tokenProvider: cognitoUserPoolsTokenProvider,
        credentialsProvider: cognitoCredentialsProvider,
      },
    });
    client = generateClient({ authMode: 'userPool' });
    return client;
  })();

  return readyPromise;
}

async function getProfile() {
  await ensureReady();
  const [user, attributes] = await Promise.all([
    getCurrentUser(),
    fetchUserAttributes().catch(() => ({})),
  ]);
  const email = attributes.email || user.signInDetails?.loginId || '';
  return {
    sub: attributes.sub || user.userId,
    username: user.username,
    email,
    displayName: attributes.name || attributes.preferred_username || email || user.username || 'Summit Rider',
  };
}

function requireModel(name) {
  if (!client?.models?.[name]) {
    throw new Error(`${name} is not available yet. Deploy the updated Amplify Data schema first.`);
  }
  return client.models[name];
}

async function listListings() {
  await ensureReady();
  const Listing = requireModel('Listing');
  const { data, errors } = await Listing.list({
    filter: { status: { eq: 'ACTIVE' } },
  });
  if (errors?.length) throw new Error(errors[0].message || 'Could not load listings.');
  return data || [];
}

async function createListing(input) {
  await ensureReady();
  const profile = await getProfile();
  const Listing = requireModel('Listing');
  const { data, errors } = await Listing.create({
    title: input.title,
    description: input.description,
    price: input.price,
    category: input.category,
    condition: input.condition,
    imageUrls: input.imageUrls || [],
    sellerSub: profile.sub,
    sellerName: profile.displayName,
    sellerEmail: profile.email,
    location: input.location || '',
    status: 'ACTIVE',
  });
  if (errors?.length) throw new Error(errors[0].message || 'Could not create listing.');
  return data;
}

async function startConversation(listing, body) {
  await ensureReady();
  const profile = await getProfile();
  if (profile.sub === listing.sellerSub) {
    throw new Error('You cannot message yourself about your own listing.');
  }

  const participantIds = [profile.sub, listing.sellerSub].filter(Boolean);
  const Conversation = requireModel('Conversation');
  const Message = requireModel('Message');
  const now = new Date().toISOString();
  const preview = body.slice(0, 140);

  const { data: conversation, errors: conversationErrors } = await Conversation.create({
    listingId: listing.id,
    listingTitle: listing.title || listing.itemName,
    buyerSub: profile.sub,
    buyerName: profile.displayName,
    sellerSub: listing.sellerSub,
    sellerName: listing.sellerName || 'Seller',
    participantIds,
    lastMessagePreview: preview,
    lastMessageAt: now,
  });
  if (conversationErrors?.length) throw new Error(conversationErrors[0].message || 'Could not start conversation.');

  const { errors: messageErrors } = await Message.create({
    conversationId: conversation.id,
    listingId: listing.id,
    senderSub: profile.sub,
    senderName: profile.displayName,
    recipientSub: listing.sellerSub,
    body,
    participantIds,
  });
  if (messageErrors?.length) throw new Error(messageErrors[0].message || 'Could not send message.');

  return conversation;
}

window.summitMarketplace = {
  createListing,
  getProfile,
  listListings,
  startConversation,
};

window.dispatchEvent(new Event('summitMarketplaceReady'));

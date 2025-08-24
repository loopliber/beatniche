import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68a9f2481b4cd619b77b533f", 
  requiresAuth: true // Ensure authentication is required for all operations
});

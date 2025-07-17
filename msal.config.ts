import { PublicClientApplication } from '@azure/msal-browser';

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: 'db39f194-b7a6-4744-a665-38d6b1333345',
    authority: 'https://login.microsoftonline.com/4916ec1c-2a4a-42b4-82f0-8952249abbd2',
    redirectUri: 'http://localhost:4200',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
});
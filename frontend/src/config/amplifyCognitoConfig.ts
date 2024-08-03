'use client'

import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      //  Amazon Cognito User Pool ID
      userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
      loginWith: {
        oauth: {
          domain: 'mycity.auth.eu-west-1.amazoncognito.com',
          scopes: [
            'email',
            'openid',
            'profile',
            'aws.cognito.signin.user.admin'
          ],
          redirectSignIn: ['http://localhost:3000'],
          redirectSignOut: ['http://localhost:3000'],
          responseType: 'token'
        }
      }
    },
    
  }
},
  {
    ssr: true
  });

// get the current config object
export const currentConfig = Amplify.getConfig();


export default function ConfigureAmplifyClientSide() {
  return null;
}
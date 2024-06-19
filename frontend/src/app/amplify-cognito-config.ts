// "use client";

// import { Amplify, type ResourcesConfig } from "aws-amplify";

// export const authConfig: ResourcesConfig["Auth"] = {
//   Cognito: {
//     userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
//     userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
//   },
// };

// Amplify.configure(
//   {
//     Auth: authConfig,
//   },
//   // { ssr: true }
// );

// export default function ConfigureAmplifyClientSide() {
//   return null;
// }


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
    }
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
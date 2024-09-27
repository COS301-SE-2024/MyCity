"use client"

import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
      userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
      loginWith: {
        oauth: {
          domain: "mycity.auth.eu-west-1.amazoncognito.com",
          scopes: [
            "email",
            "openid",
            "profile",
            "aws.cognito.signin.user.admin"
          ],
          redirectSignIn: ["http://localhost:3000/dashboard/citizen", "https://www.dev.mycity.net.za/dashboard/citizen", "https://www.mycity.net.za/dashboard/citizen"],
          redirectSignOut: ["http://localhost:3000", "https://www.dev.mycity.net.za", "https://www.mycity.net.za"],
          responseType: "token"
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
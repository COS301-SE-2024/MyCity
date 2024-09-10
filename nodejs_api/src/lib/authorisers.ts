


// const REST_API_AUTHORIZER = process.env.REST_API_AUTHORIZER;
// const USER_POOL_ARN = process.env.USER_POOL_ARN;

// import * as AWS from 'aws-sdk';
// import * as dotenv from 'dotenv';
// import { cognitoClient } from '../config/dynamodb.config';

// dotenv.config();
// cognitoClient.

// // Load environment variables
// const REST_API_AUTHORIZER = process.env.REST_API_AUTHORIZER;
// const USER_POOL_ARN = process.env.USER_POOL_ARN;

// if (!REST_API_AUTHORIZER || !USER_POOL_ARN) {
//   throw new Error('Missing environment variables for Cognito setup');
// }

// // Create a Cognito User Pool Authorizer function
// const cognitoAuthorizer = (req: any, res: any, next: any) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Authorization token missing' });
//   }

//   // Use the AWS SDK Cognito Identity Provider client to validate the token
//   const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

//   cognitoidentityserviceprovider.getUser({ AccessToken: token }, (err, data) => {
//     if (err) {
//       return res.status(401).json({ message: 'Invalid token', error: err });
//     }

//     // If the token is valid, you can proceed with the request
//     req.user = data;
//     next();
//   });
// };

// export { cognitoAuthorizer };

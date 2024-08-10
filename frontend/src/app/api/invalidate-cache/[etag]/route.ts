import { NextRequest } from "next/server";
import { Amplify } from "aws-amplify";
import { revalidateTag } from "next/cache";


//configure amplify for server-side rendering to enable use of Next.js api route
Amplify.configure({},
  {
    ssr: true
  });

export async function GET(req: NextRequest, { params }: { params: { etag: string } }) {
  const { etag } = params;

  if (!etag) {
    throw new Error("missing etag");
  }


  revalidateTag(etag); //invalidate the cache

  return Response.json({ isCacheInvalidated: true });

}
import { NextRequest } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {

  if (!API_BASE_URL) {
    throw new Error("missing api base url");
  }

  const endpointUrl = req.url.replace("http://localhost:3000/api", API_BASE_URL);
  const etag = params.slug.join("-");

  const res = await fetch(endpointUrl, {
    headers: req.headers,
    next: { tags: [etag] },
    cache: "force-cache"
  });

  const data = await res.json();

  return Response.json({ data });
}


export async function POST(req: NextRequest, { params }: { params: { slug: string[] } }) {

  if (!API_BASE_URL) {
    throw new Error("missing api base url");
  }

  const endpointUrl = req.url.replace("http://localhost:3000/api", API_BASE_URL);
  // const etag = params.slug.join("-");

  const requestBody = await req.json();

  const res = await fetch(endpointUrl, {
    method: "POST",
    headers: req.headers,
    body: JSON.stringify(requestBody),
    // next: { tags: [etag] },
    // cache: "force-cache"
  });


  const data = await res.json();


  return Response.json({ data });
}
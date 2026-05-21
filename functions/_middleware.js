const REALM = "Wanning He private preview";

function unauthorized() {
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
    },
  });
}

function getCredentials(request) {
  const header = request.headers.get("Authorization") || "";

  if (!header.startsWith("Basic ")) {
    return null;
  }

  try {
    const decoded = atob(header.slice("Basic ".length));
    const separator = decoded.indexOf(":");

    if (separator < 0) {
      return null;
    }

    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

function timingSafeEqual(left, right) {
  const leftBytes = new TextEncoder().encode(left || "");
  const rightBytes = new TextEncoder().encode(right || "");
  const length = Math.max(leftBytes.length, rightBytes.length);
  let mismatch = leftBytes.length === rightBytes.length ? 0 : 1;

  for (let index = 0; index < length; index += 1) {
    mismatch |= (leftBytes[index] || 0) ^ (rightBytes[index] || 0);
  }

  return mismatch === 0;
}

export async function onRequest(context) {
  const expectedUser = context.env.BASIC_AUTH_USER;
  const expectedPassword = context.env.BASIC_AUTH_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return new Response("Basic Auth is not configured", {
      status: 500,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  const credentials = getCredentials(context.request);

  if (!credentials) {
    return unauthorized();
  }

  const userMatches = timingSafeEqual(credentials.username, expectedUser);
  const passwordMatches = timingSafeEqual(credentials.password, expectedPassword);

  if (!userMatches || !passwordMatches) {
    return unauthorized();
  }

  const response = await context.next();
  const protectedResponse = new Response(response.body, response);
  protectedResponse.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return protectedResponse;
}

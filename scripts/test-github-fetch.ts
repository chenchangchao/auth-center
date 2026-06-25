// scripts/test-github-fetch.ts
async function main() {
  console.log("Testing Node/Bun fetch to GitHub...");

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      client_id: "dummy",
      client_secret: "dummy",
      code: "dummy",
      redirect_uri: "http://localhost:3000/api/auth/callback/github",
    }),
  });

  console.log("status:", res.status);
  console.log(await res.text());
}

main().catch((err) => {
  console.error("fetch failed:");
  console.error(err);
  process.exit(1);
});
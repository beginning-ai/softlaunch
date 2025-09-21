# Softlaunch

Beginnings landing page + email sign up

Stack:
* HTML/CSS
* Cloudflare Pages Functions (serverless email sign up handler)
* Cloudflare D1 (store emails sign ups)
* Zoho ZeptoMail (confirmation email)

## Local dev

```sh
npx wrangler pages dev
```

## Manage Cloudflare D1

```sh
# Run migration
npx wrangler d1 execute softlaunch_d1 --local --file=./schema.sql

# View rows
npx wrangler d1 execute softlaunch_d1 --local --command="SELECT * FROM signup"
```

Swap `--local` with `--remote` to manage live instance on Cloudflare.

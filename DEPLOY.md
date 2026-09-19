# Deploy InventoryPro (GitHub -> Render, MongoDB Atlas, Resend)

## 1. MongoDB Atlas
1. Create a free **M0** cluster.
2. Database Access -> add a user (username + password; avoid `@ : /` in the password).
3. Network Access -> add IP `0.0.0.0/0` (Render uses changing IPs).
4. Connect -> Drivers -> copy the `mongodb+srv://...` string and put your password in it. This is `MONGO_URL`.

## 2. Resend (email)
1. Sign up at resend.com with the email you want alerts sent to, then create an **API key** (`re_...`).
2. Testing: the default sender `onboarding@resend.dev` can only deliver to your own Resend signup email.
   Enquiry notifications to you will work; the auto-reply to the visitor will not.
3. For customer-facing emails: Resend -> Domains -> add `inventorypro.in`, add the DNS records it shows at your
   domain registrar, then set `RESEND_FROM_EMAIL` to e.g. `hello@inventorypro.in` on Render.

## 3. GitHub
Create an empty **private** repo, then from this folder:
```
git init && git add . && git commit -m "InventoryPro"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```
(`.gitignore` already keeps `.env` files out.)

## 4. Render
New -> **Blueprint** -> pick the repo. Render reads `render.yaml` and creates two services. Fill in when asked:

| Variable | Value |
|---|---|
| MONGO_URL | Atlas string from step 1 |
| OWNER_SEED_EMAIL / OWNER_SEED_PASSWORD | your owner login (choose a strong password) |
| RESEND_API_KEY | from step 2 |
| EMAIL_REPLY_TO / OWNER_EMAIL | your email |
| REACT_APP_BACKEND_URL | `https://inventorypro-api.onrender.com` (no trailing slash) |

If Render gives the API a different URL (name taken), open `inventorypro-web` -> Environment, fix
`REACT_APP_BACKEND_URL`, then Manual Deploy -> **Clear build cache & deploy** (the value is baked in at build time).

## 5. Lock down CORS
On `inventorypro-api` -> Environment set `CORS_ORIGINS` to your frontend URL (e.g. `https://inventorypro-web.onrender.com`),
later also your custom domain, comma-separated.

## 6. Verify
- `https://<api-url>/api/` returns `{"message":"InventoryPro.in API"}`
- Open the frontend URL -> Login -> owner email/password -> dashboard loads with demo data
- Submit the enquiry form -> check the Enquiries page and your inbox
- Upload a dish photo (Recipes) and reload it

## 7. Custom domain (optional, do after go-live)
Render -> `inventorypro-web` -> Settings -> Custom Domains -> add `inventorypro.in` and `www`, then add the DNS records shown.

## Notes
- **Free plan sleeps** after ~15 min idle (first request takes ~50 s) and the 8 AM / 10:30 PM IST alert loop only runs while the API is awake.
  Use Render's Starter plan, or ping `https://<api-url>/api/` every 5 minutes with UptimeRobot.
- Dish photos are stored in MongoDB (`file_blobs`). Atlas M0 has 512 MB.
- Demo manager/chef logins are **off** (`SEED_DEMO_USERS=false`). Create staff from Settings after logging in as owner.
- To reset the owner password: change `OWNER_SEED_PASSWORD` on Render and redeploy/restart.

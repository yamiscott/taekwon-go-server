Notes:

- Dockerfile uses `npm ci --only=production` so dev-deps (nodemon/jest) are not installed in the image build.
- For local development using `docker compose`, you may mount code or adjust command to use `npm run dev` if you want nodemon behavior.

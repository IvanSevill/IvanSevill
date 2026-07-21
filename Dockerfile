FROM node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci \
    && npm install --no-save \
      "@rollup/rollup-linux-arm64-musl@$(node -p 'require("./node_modules/rollup/package.json").version')" \
      "@tailwindcss/oxide-linux-arm64-musl@$(node -p 'require("./node_modules/@tailwindcss/oxide/package.json").version')" \
      "lightningcss-linux-arm64-musl@$(node -p 'require("./node_modules/lightningcss/package.json").version')"

COPY . .
RUN npm run lint && npm run build

FROM nginx:1.29-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

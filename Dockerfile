FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat git
WORKDIR /app

ARG GHCR_TOKEN
ENV GHCR_TOKEN=$GHCR_TOKEN

COPY package.json ./
RUN git config --global url."https://${GHCR_TOKEN}@github.com/".insteadOf "ssh://git@github.com/" && \
    git config --global url."https://${GHCR_TOKEN}@github.com/".insteadOf "git@github.com:"
RUN --mount=type=cache,target=/root/.npm npm install --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM nginx:1.27-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["sh", "-c", "echo \"window.__ENV__ = { VITE_API_URL: '$VITE_API_URL', VITE_KEYCLOAK_URL: '$VITE_KEYCLOAK_URL', VITE_KEYCLOAK_REALM: '$VITE_KEYCLOAK_REALM', VITE_KEYCLOAK_CLIENT_ID: '$VITE_KEYCLOAK_CLIENT_ID' };\" > /usr/share/nginx/html/config.js && exec nginx -g 'daemon off;'"]

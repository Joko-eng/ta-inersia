FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci


FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG MONGODB_URI
ARG REDIS_URL

ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV MONGODB_URI=$MONGODB_URI
ENV REDIS_URL=$REDIS_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build


FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public            ./public
COPY --from=builder /app/.next/standalone  ./
COPY --from=builder /app/.next/static      ./.next/static
COPY --from=builder /app/scripts           ./scripts
COPY --from=builder /app/node_modules      ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
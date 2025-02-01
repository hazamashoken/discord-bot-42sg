FROM node:22-bookworm-slim AS base

RUN apt update && apt install -y
COPY . /app
WORKDIR /app

RUN chown -R node:node /app


FROM base AS prod-deps
RUN npm ci --omit-dev


FROM base AS build
RUN npm ci
RUN npm run build


FROM base
ENV NODE_ENV=production

WORKDIR /app
COPY --chown=node:node --from=prod-deps /app/node_modules /app/node_modules

COPY --chown=node:node --from=build /app/dist /app/dist
COPY --chown=node:node --from=build /app/package*.json /app/

USER node

CMD ["node", "./dist/bot.js"] 
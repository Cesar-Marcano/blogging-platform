FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENV NODE_ENV="production"
ENV PORT=80

RUN corepack enable

COPY ./package.json ./pnpm-lock.yaml /app/

WORKDIR /app

FROM base AS prod-deps

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build

COPY . /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm run build

FROM base

COPY --from=prod-deps /app/node_modules /app/node_modules

COPY --from=build /app/dist /app/dist

EXPOSE 80

CMD [ "pnpm", "start:prod" ]

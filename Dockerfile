FROM oven/bun:1 as base
WORKDIR /usr/src/app

FROM base AS install
ENV HUSKY=0
RUN apt-get update && apt-get install -y curl
ARG NODE_VERSION=18
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
  && bash n $NODE_VERSION \
  && rm n \
  && npm install -g n
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
COPY prisma /temp/dev/prisma/
RUN cd /temp/dev && bun install --frozen-lockfile
RUN cd /temp/dev && bunx prisma generate

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production 

FROM install AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM base AS release
ENV NODE_ENV=production
COPY --from=install /temp/prod/node_modules ./node_modules
COPY --from=install /temp/dev/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/dist ./dist

USER bun
EXPOSE 3000/tcp
CMD ["bun", "run", "start:prod"]
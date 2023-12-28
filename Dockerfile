FROM node:lts-alpine
# FROM kobza95/test-nest:latest


WORKDIR /app

COPY package*.json ./
RUN npm i pnpm -g

COPY ./ ./


RUN pnpm install
RUN pnpm build



USER node

#get or create https certs
CMD [ "pnpm", "start:prod" ]


EXPOSE 3000

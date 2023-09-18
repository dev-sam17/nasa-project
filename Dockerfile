FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY client/ client/
RUN npm run install-client --omit=dev

COPY server/ server/
RUN npm run install-server --omit=dev

# COPY client/ client/
RUN npm run build --prefix client

# COPY server/ server/

USER node

CMD [ "npm", "start", "--prefix", "server" ]

EXPOSE 8000
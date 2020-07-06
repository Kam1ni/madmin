FROM node:12

COPY server/dist /home/node/app/dist
COPY server/node_modules /home/node/app/node_modules
WORKDIR /home/node/app

EXPOSE 80
EXPOSE 443

ENTRYPOINT [ "npm", "run", "start" ]
FROM node:12-slim
WORKDIR /usr/src/app
RUN chown -R node:node /usr/src/app
USER node
COPY --chown=node:node . ./
RUN npm install --only=prod && npm cache clean --force
COPY --chown=node:node . .
EXPOSE 3000
CMD [ "node","index.js" ]
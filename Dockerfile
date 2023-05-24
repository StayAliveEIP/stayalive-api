FROM node AS prod
ENV NODE_ENV="prod"
WORKDIR /app
COPY .env .
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]

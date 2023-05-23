FROM node AS prod
ENV NODE_ENV="prod"
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 80
CMD ["node", "dist/main"]

FROM node:20-bullseye

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 4000 4173 5173

ENV NODE_ENV=production

CMD ["bash", "-lc", "./scripts/run.sh"]

FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --production=false

COPY . .

ENV PORT=7860
ENV NODE_ENV=production

EXPOSE 7860

CMD ["npm", "start"]

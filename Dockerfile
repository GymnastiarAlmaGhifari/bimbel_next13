FROM node:18-alpine3.16

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD npm run dev
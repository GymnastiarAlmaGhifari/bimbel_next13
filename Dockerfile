FROM node:18-alpine3.16

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .


RUN npx prisma generate

RUN npm run build

EXPOSE 3000


# CMD npm run dev
# run for production
CMD npm run start
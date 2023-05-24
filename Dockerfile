FROM node:18-alpine3.16

WORKDIR /linear

COPY package*.json ./

RUN npm install

COPY . .

ENV DATABASE_URL=mysql://root:abogoboga@10.1.1.13:3306/nextlinear

ENV NEXTAUTH_URL=http://localhost:3000

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

VOLUME ["/linear/upload"]

# CMD npm run dev
# run for production
CMD npm run start
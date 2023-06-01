# FROM node:18-alpine3.16

# WORKDIR /linear

# COPY package*.json ./

# RUN npm install

# COPY . .

# ENV DATABASE_URL=mysql://root:abogoboga@10.1.1.13:3306/nextlinear

# ENV NEXTAUTH_URL=http://localhost:3000

# RUN npx prisma generate

# RUN npm run build

# EXPOSE 3000

# VOLUME ["/linear/upload"]

# # CMD npm run dev
# # run for production
# CMD npm run start


FROM node:18-alpine3.16 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine3.16 AS runner
WORKDIR /app
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/upload ./upload
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/ ./.next
COPY --from=builder /app/.env ./.env

ENV DATABASE_URL=mysql://root:abogoboga@10.1.1.13:3306/nextlinear
ENV NEXTAUTH_URL=http://localhost:3000
VOLUME ["/app/upload"]

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "start" ]
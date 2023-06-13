# FROM node:18-alpine3.16 AS builder

# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm install --frozen-lockfile
# COPY . .
# RUN npx prisma generate
# RUN npm run build

# FROM node:18-alpine3.16 AS runner
# WORKDIR /app
# COPY --from=builder /app/package.json .
# COPY --from=builder /app/package-lock.json .
# COPY --from=builder /app/next.config.js ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/upload ./upload
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/.next/ ./.next
# COPY --from=builder /app/.env ./.env

# ENV DATABASE_URL=mysql://root:abogoboga@10.1.1.13:3306/nextlinear
# ENV NEXTAUTH_URL=http://localhost:3000
# VOLUME ["/app/upload"]

# EXPOSE 3000

# ENTRYPOINT [ "npm", "run", "start" ]


FROM node:lts-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:lts-slim AS runner

# Install additional dependencies
RUN apt-get update && apt-get install -y gnupg wget && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/google.list && \
    apt-get update && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf && \
    rm -rf /var/lib/apt/lists/*

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

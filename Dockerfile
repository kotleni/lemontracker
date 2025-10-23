# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Copy package files and install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application source code
COPY . .

# Set the environment to production and build the app
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine AS runner
WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production

# Copy only the necessary files from the builder stage
# COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Start the Next.js production server
CMD ["npm", "run", "start"]

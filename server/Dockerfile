FROM ghcr.io/puppeteer/puppeteer:latest

# Set cache dir to a folder pptruser owns
ENV PUPPETEER_CACHE_DIR=/home/pptruser/.cache/puppeteer

WORKDIR /usr/src/app

COPY package*.json ./

# Switch to root to install dependencies and fix permissions
USER root

# Install dependencies (this will download correct Chrome version)
RUN npm ci

# Copy all source files
COPY . .

# Create uploads folder
RUN mkdir -p uploads

# Grant ownership of EVERYTHING to pptruser so it can read/write freely
RUN chown -R pptruser:pptruser /usr/src/app

# Switch back to the correct user
USER pptruser

CMD [ "node", "index.js" ]

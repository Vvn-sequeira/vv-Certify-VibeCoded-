FROM ghcr.io/puppeteer/puppeteer:19.11.1

# Skip downloading Chrome because we use the installed one
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
# Switch to root to install deps and fix permissions
USER root
RUN npm ci

COPY . .

# Create uploads folder and grant full read/write permissions
RUN mkdir -p uploads && chmod -R 777 uploads

# Switch back to non-root user
USER pptruser

CMD [ "node", "index.js" ]

FROM ghcr.io/puppeteer/puppeteer:19.11.1

# Skip downloading Chrome because we use the installed one
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Create uploads folder and grant write permissions
RUN mkdir -p uploads && chmod 777 uploads

COPY package*.json ./
RUN npm ci

COPY . .

CMD [ "node", "index.js" ]

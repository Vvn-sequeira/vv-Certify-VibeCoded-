# 🚀 Deployment Guide (Simple Version)

Here is exactly what you need to do:

### 1️⃣ Deploy Backend (Server)
Go to **[Render.com](https://render.com)** to host the Node.js server.
- **Root Directory**: Set to `server`
- **Build Command**: `npm install`
- **Start Command**: `node index.js`
- **Important**: This server handles the heavy certificate generation.

### 2️⃣ Deploy Frontend (Client)
Go to **[Vercel.com](https://vercel.com)** to host the React website.
- **Root Directory**: Set to `client`
- **Environment Variables**:
  - Add a new variable named `VITE_API_URL`.
  - Set the value to your **Render Backend URL** (copy it from Render dashboard).

---
**Why two places?**
- **Vercel** makes your website load super fast globally.
- **Render** gives your backend the power it needs to run Chrome (Puppeteer) for generating PDFs.

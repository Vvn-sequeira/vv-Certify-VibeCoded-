# 🎓 vv-Certify

> **Unique. Free. Lightning Fast.** ⚡
> A premium, high-performance bulk certificate generation tool designed for speed and simplicity.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-Green-success?style=for-the-badge)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

## 🏗️ System Design

Top-tier architecture designed for local efficiency and seamless user experience.

### Architecture Diagram

```mermaid
graph TD
    subgraph Client [🖥️ Frontend (React + Vite)]
        Landing[Landing Page] -->|GSAP Animation| Designer[Certificate Designer]
        Designer -->|Upload| Assets[Images & CSV]
        Designer -->|Config| State[Field Positions & Styles]
    end

    subgraph Server [⚙️ Backend (Node.js)]
        API[Express API] -->|Receive Data| Processor[Certificate Engine]
        Processor -->|Generate Images| Sharp[Sharp / Canvas]
        Sharp -->|Bundle| Archiver[Zip Streams]
    end

    User((👤 User)) -->|Interact| Client
    Client --POST /generate--> API
    API --Returns ZIP Blob--> Client
    Client -->|Auto Download| User
```

### 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 18+ | Component-based UI Architecture |
| **Build Tool** | Vite | Lightning-fast HMR and bundling |
| **Animations** | GSAP | High-performance ScrollTrigger & Reveal effects |
| **Styling** | CSS3 | Custom Glassmorphism & Neon Design System |
| **Backend** | Node.js | Scalable server processing |
| **Image Proc** | Canvas/Sharp | High-quality image compositing |

## 🚀 Key Features

- **🎨 Drag & Drop Designer**: Intuitive canvas to position text fields dynamically.
- **⚡ Bulk Generation**: Process thousands of records from a single CSV file.
- **🖱️ Interactive UI**: Premium "Black & Green" aesthetic with mouse-reactive parallax.
- **📥 Smart Suggestions**: Intelligent snackbars with auto-download sample files.
- **🔒 Local Processing**: Your data stays within your control.

## 📦 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vvn-sequeira/vv-Certify.git
   cd vv-Certify
   ```

2. **Start the Backend**
   ```bash
   cd server
   npm install
   node index.js
   ```
   > Server runs on http://localhost:3000

3. **Start the Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   > Client runs on http://localhost:5173

## 🤝 Contribution

Contributions are welcome! Feel free to open an issue or submit a Pull Request.

---
*Vibe-coded by Vivian Marcel Sequeria*

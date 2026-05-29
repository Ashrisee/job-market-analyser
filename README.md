# 🚀 CareerScope AI

> **Decode the Job Market.** — An AI-powered job intelligence platform that scrapes real-time job data, analyzes market trends, and delivers personalized career insights.

![CareerScope AI](https://img.shields.io/badge/CareerScope-AI%20Platform-00d4ff?style=for-the-badge&logo=sparkles)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Flask](https://img.shields.io/badge/Flask-3.1-000?style=flat-square&logo=flask)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwindcss)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Real-Time Job Scraping** | Scrapes live jobs from JSearch, Adzuna, and Internshala |
| 🎯 **Smart Job Matching** | Multi-dimensional scoring (skills, experience, location, salary) |
| 📊 **Salary Analytics** | Breakdown by location, experience level, and percentiles |
| 📈 **Market Trends** | Trending skills, remote vs onsite ratios, top companies |
| 🧠 **Skill Gap Analysis** | Identifies missing skills with a personalized learning roadmap |
| 💡 **AI Insights** | Generates career recommendations based on your profile |
| 📄 **Export Reports** | Download your complete analysis as JSON |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite 8** — Lightning-fast SPA
- **Tailwind CSS v4** — Utility-first styling
- **Framer Motion** — Premium animations & transitions
- **Recharts** — Interactive data visualizations
- **React Router** — Client-side routing

### Backend
- **Python Flask** — Lightweight REST API
- **JSearch API** (RapidAPI) — Job listings from LinkedIn, Indeed, Glassdoor
- **Adzuna API** — Job market data from 16+ countries
- **Internshala Scraper** — Native web scraping for Indian internships and jobs
- **Custom Analytics Engine** — Modular analysis pipeline

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **Python** 3.9+
- API keys from [RapidAPI (JSearch)](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) and [Adzuna](https://developer.adzuna.com/)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/careerscope-ai.git
cd careerscope-ai
```

### 2. Set up the Environment & Backend
```bash
# Create .env file in the project root
cp .env.example .env
# Edit .env with your API keys

cd backend
pip install -r requirements.txt
```

### 3. Set up the Frontend
```bash
cd ../frontend
npm install
```

### 4. Run the app
```bash
# Terminal 1: Backend (runs on :5001)
cd backend && python app.py

# Terminal 2: Frontend (runs on :5173)
cd frontend && npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔑 Environment Variables

Create a `.env` file in the **project root** directory:

```env
JSEARCH_API_KEY=your_jsearch_rapidapi_key
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
FLASK_DEBUG=true
FLASK_PORT=5001
```

---

## 📁 Project Structure

```
careerscope-ai/
├── .env.example                # Example environment variables (copy to .env)
├── backend/
│   ├── app.py                  # Flask API server
│   ├── config.py               # Environment configuration
│   ├── requirements.txt        # Python dependencies
│   ├── scraper/
│   │   ├── base_scraper.py     # Abstract scraper class
│   │   ├── jsearch_scraper.py  # JSearch API integration
│   │   ├── adzuna_scraper.py   # Adzuna API integration
│   │   └── internshala_scraper.py # Internshala web scraper
│   └── analytics/
│       ├── analyzer.py         # Core job analysis engine
│       ├── matcher.py          # Multi-dimensional matching
│       ├── salary.py           # Salary analytics
│       └── trends.py           # Market trend analysis
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/        # Hero, Features, Stats, AI Animation
│   │   │   ├── forms/          # Profile form, Skill input
│   │   │   ├── dashboard/      # Charts, Stats, Job listings
│   │   │   ├── layout/         # Navbar, Footer, Cursor
│   │   │   └── ui/             # GlowButton, Shimmer, Counter
│   │   ├── pages/              # LandingPage, Dashboard
│   │   ├── services/           # API client
│   │   └── utils/              # Constants
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```

---

## 🎨 Design Philosophy

- **Linear/Stripe-inspired** dark mode UI
- **Glassmorphism** cards with glow effects
- **Typewriter animation** hero heading
- **Particle backgrounds** and gradient blobs
- **Smooth page transitions** with Framer Motion
- **Responsive** layout from mobile to 4K

---

## 📸 Screenshots

> Run the app locally to see the full experience with animations.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ as a portfolio project<br>
  <strong>CareerScope AI</strong> — Decode the Job Market.
</p>

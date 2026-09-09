# farmX | MERN Stack Agritech & Direct Farmer-to-Buyer Marketplace

A full-stack agricultural decision support and digital trading ecosystem built with the **MERN Stack** (MongoDB, Express.js, React 19, Node.js).

---

## 🌟 Key Features

### 1. 🌦️ Hyper-Local Weather & "Smart Spray Advisory"
- **Open-Meteo Meteorological API Integration**: Covers all 31 districts of Karnataka + Browser GPS Geolocation.
- **Dynamic Spray Safety Banner**:
  - 🟢 **Safe Spraying Window Active**: Wind speed < 12 km/h, rain probability < 20%.
  - 🔴 **Do Not Spray Today**: Rain probability > 45% (prevents chemical runoff & financial loss) or wind speed > 15 km/h (drift hazard).
  - ⚠️ **High Humidity / Fungal Risk**: Humidity > 78% flags blight and mildew risk in Tomato, Chilli, and Pomegranate.
- **Hourly Spray Suitability Timeline**: 12-hour breakdown with color-coded safety indicators.
- **7-Day Extended Agricultural Forecast**: Daily maximum/minimum temperatures, rainfall probability, and wind velocity.

### 2. 🌾 Live "e-Mandi" Marketplace & Seller Portal
- **For Farmers (Sellers)**:
  - **"List My Harvest" Form**: Post crop name, variety, expected harvest date, quantity in quintals, base price (₹/Qtl), and description.
  - **Incoming Bids Manager**: Real-time review of buyer offers with one-click **"Accept Offer"** or **"Reject Offer"** actions.
  - **APMC Mandi Dispatch Pass**: Auto-generated gate pass and transport clearance slip (`FX-PASS-XXXXXX`).
- **For Buyers**:
  - Live marketplace browsing with crop and district filters.
  - **1-Click WhatsApp Connect**: Direct chat button opening WhatsApp with an auto-composed procurement message.
  - **"Make an Offer" Bidding Modal**: Submit custom price proposals and procurement quantities directly to the seller.

### 3. 📡 Automated Mandi Price Synchronization (`node-cron`)
- Scheduled automated background service running daily at **06:00 AM IST** (`0 6 * * *`).
- Updates APMC mandi prices for 23+ Karnataka crops and maintains a rolling **14-day historical price trend**.
- Manual on-demand sync endpoint available at `POST /api/crops/sync`.

### 4. 📄 Downloadable PDF "Farm Advisory & Soil Health Card"
- Generated via `jspdf` and `jspdf-autotable`.
- Branded official PDF export from the **Fertilizer Calculator** and **AI Crop Guide**:
  - Farmer details (Name, Village, Acreage, Cultivated Crop).
  - Scientific N-P-K Fertilizer Schedule (Basal, 1st Top Dressing at 30 days, 2nd Top Dressing at 60 days).
  - Agronomic precautions and weather spray advisory.
  - Emergency Krishi Vigyan Kendra (KVK) helpline contacts (1800-180-1551).

### 5. 🤖 Bilingual Google Gemini AI Crop Advisor
- Integrated with Google Gemini 2.5 Flash via REST API.
- Generates dual-language advice: first in simple English, followed by simple Kannada (ಕನ್ನಡ).
- Voice search (speech-to-text) and Text-to-Speech (TTS) audio playback.
- Offline expert fallback mode for uninterrupted resilience.

### 6. 🌐 Full English & Kannada Bilingual UI
- Instant toggle between English and ಕನ್ನಡ across all screens and notifications.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 1. Start the MERN Backend
```powershell
cd backend
npm install
npm run seed     # Seeds 23+ APMC crops, schemes, buyers, and demo harvest listings
npm start        # Starts Express server on http://localhost:5000
```

### 2. Start the React Frontend
```powershell
cd frontend
npm install --legacy-peer-deps
npm start        # Launches React app on http://localhost:3000
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/weather?district=Mandya` | 7-day weather forecast & smart spray advisory |
| `GET` | `/api/emandi/listings` | Browse active harvest marketplace listings |
| `POST` | `/api/emandi/listings` | Seller posts new harvest listing |
| `POST` | `/api/emandi/listings/:id/offers` | Buyer submits price offer / bid |
| `PATCH` | `/api/emandi/listings/:id/offers/:offerId` | Seller accepts or rejects offer |
| `GET` | `/api/crops` | 23+ APMC crops with 14-day price history |
| `POST` | `/api/crops/sync` | Trigger daily Mandi rate synchronization |
| `POST` | `/api/ai/text` | Bilingual Gemini agricultural consultation |
| `GET` | `/api/schemes` | Pre-crop & crop loss government schemes |
| `GET` | `/api/buyers` | Verified wholesale agro buyers |

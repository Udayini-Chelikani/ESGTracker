# ESG Payment Scanner

AI-powered ESG (Environmental, Social, Governance) scoring for bank payment
data. Extracts ESG signals from
transaction records using Gemini, computes weighted scores per client,
detects anomalies, and visualizes it all on a dashboard.

Stack: MongoDB, Express, React, Node (MERN) + Google Gemini for classification.

## Structure

```
esg-payment-scanner/
├── backend/      Express API, MongoDB models, Gemini integration, scoring & anomaly logic
└── frontend/     React (Vite) dashboard

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # add MONGO_URI and GEMINI_API_KEY
npm run dev                # runs on http://localhost:5000
```

In a second terminal, load demo data:

```bash
cd backend
npm run seed
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL defaults to http://localhost:5000/api
npm run dev                 # runs on http://localhost:5173
```

Open `http://localhost:5173` — you should see the client register populated
from the seed data, with scores, anomaly flags, and per-client detail pages.

## How the pieces fit together

1. A transaction (client, beneficiary, remittance text, amount) is submitted
   from the **Add transaction** page or a CSV batch upload.
2. The backend checks a **beneficiary cache** first; if new, it sends the
   transaction to **Gemini** with a structured prompt asking for E/S/G impact
   scores, a sector, and a confidence level, as JSON.
3. The backend — not Gemini — computes the final **weighted score**, scaling
   impact by transaction size and classification confidence.
4. **Rule-based anomaly checks** compare the new score against the client's
   rolling history (sector shifts, score drops, high-risk language).
5. The client's running E/S/G scores update via an exponential moving
   average, and everything is stored in MongoDB.
6. The React dashboard reads it all back: a sortable client register, a
   radar chart and trend line per client, sector breakdowns, and an
   anomaly feed with the reasoning behind each flag.

## Where to go next

- Swap the rule-based anomaly checks for a proper statistical/ML model once
  you have more transaction volume.
- Add authentication if this moves past the hackathon demo stage.
- Consider batching Gemini calls or adding a queue if transaction volume
  grows — right now classification happens synchronously per request.

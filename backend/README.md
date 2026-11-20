# ESG Payment Scanner — Backend

AI-powered ESG scoring for payment transactions, using Gemini for classification and rule-based logic for scoring and anomaly detection.

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — a local MongoDB (`mongodb://localhost:27017/esg-payment-scanner`) or an Atlas connection string.
- `GEMINI_API_KEY` — get one free at https://aistudio.google.com/apikey

## Run

```bash
npm run dev
```

Server starts on `http://localhost:5000`. Check it's alive:

```bash
curl http://localhost:5000/api/health
```

## Load demo data

With the server running in one terminal, in another:

```bash
npm run seed
```

This posts 6 sample transactions through the real pipeline (Gemini classification → scoring → anomaly check), so your dashboard has data immediately.

## API reference

| Method | Route | Description |
|---|---|---|
| POST | `/api/transactions` | Submit a transaction; runs the full ESG pipeline |
| GET | `/api/transactions?clientName=&limit=` | List transactions |
| GET | `/api/transactions/:id` | Get one transaction |
| GET | `/api/clients` | List all clients with running scores |
| GET | `/api/clients/:clientName` | One client's full profile |
| GET | `/api/clients/:clientName/transactions` | All transactions for a client |
| GET | `/api/anomalies?limit=` | Recent flagged transactions |
| GET | `/api/anomalies/needs-review` | Transactions where AI classification failed |

## Example request

```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Alpha Manufacturing Ltd",
    "beneficiaryName": "Deccan Coal Supply Co",
    "remittanceInfo": "Q3 coal supply for boiler operations",
    "amount": 20000000,
    "currency": "INR"
  }'
```

## How it's organized

- `config/` — DB and Gemini client setup
- `models/` — Mongoose schemas (Transaction, Client, BeneficiaryCache)
- `services/` — the actual logic: Gemini prompt/call, scoring math, anomaly rules
- `controllers/` — HTTP handlers, thin — they call services and return JSON
- `routes/` — Express route definitions
- `middleware/` — request validation (zod) and centralized error handling
- `utils/` — stats helpers, Gemini response parsing/validation

Gemini is only ever called from `services/geminiService.js`, and results are validated with zod before anything trusts them — if Gemini returns malformed JSON or the call fails, the transaction is still saved (marked `needsReview: true`) rather than breaking the pipeline mid-demo.

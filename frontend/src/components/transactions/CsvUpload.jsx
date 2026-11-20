import { useState } from "react";
import Papa from "papaparse";
import axiosClient from "../../api/axiosClient.js";

// Expects a CSV with headers: clientName, beneficiaryName, remittanceInfo, amount, currency
// Posts each row through the same pipeline as the manual form, sequentially
// (not in parallel) so we don't burst past Gemini's rate limits.
export default function CsvUpload({ onBatchResult }) {
  const [status, setStatus] = useState(null); // { total, done, failed }
  const [running, setRunning] = useState(false);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        setRunning(true);
        setStatus({ total: rows.length, done: 0, failed: 0 });

        for (const row of rows) {
          try {
            await axiosClient.post("/transactions", {
              clientName: row.clientName,
              beneficiaryName: row.beneficiaryName,
              remittanceInfo: row.remittanceInfo || "",
              amount: Number(row.amount),
              currency: row.currency || "INR",
            });
            setStatus((s) => ({ ...s, done: s.done + 1 }));
          } catch {
            setStatus((s) => ({ ...s, failed: s.failed + 1 }));
          }
        }

        setRunning(false);
        onBatchResult?.();
      },
    });

    e.target.value = ""; // allow re-uploading the same file name
  }

  return (
    <div className="card">
      <label htmlFor="csv-upload">Upload CSV</label>
      <p className="hint" style={{ marginTop: -4, marginBottom: 10 }}>
        Columns: clientName, beneficiaryName, remittanceInfo, amount, currency
      </p>
      <input id="csv-upload" type="file" accept=".csv" onChange={handleFile} disabled={running} />

      {status && (
        <p className="hint tabular" style={{ marginTop: 12 }}>
          {status.done + status.failed} / {status.total} processed
          {status.failed > 0 && (
            <span style={{ color: "var(--gold)" }}> · {status.failed} failed</span>
          )}
        </p>
      )}
    </div>
  );
}

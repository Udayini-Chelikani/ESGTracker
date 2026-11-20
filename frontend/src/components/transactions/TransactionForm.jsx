import { useState } from "react";
import axiosClient from "../../api/axiosClient.js";

const emptyForm = {
  clientName: "",
  beneficiaryName: "",
  remittanceInfo: "",
  amount: "",
  currency: "INR",
};

export default function TransactionForm({ onResult }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await axiosClient.post("/transactions", {
        ...form,
        amount: Number(form.amount),
      });
      onResult?.(res.data);
      setForm(emptyForm);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to submit transaction"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="field">
        <label htmlFor="clientName">Client</label>
        <input
          id="clientName"
          required
          value={form.clientName}
          onChange={(e) => update("clientName", e.target.value)}
          placeholder="Alpha Manufacturing Ltd"
        />
      </div>

      <div className="field">
        <label htmlFor="beneficiaryName">Beneficiary</label>
        <input
          id="beneficiaryName"
          required
          value={form.beneficiaryName}
          onChange={(e) => update("beneficiaryName", e.target.value)}
          placeholder="Deccan Coal Supply Co"
        />
      </div>

      <div className="field">
        <label htmlFor="remittanceInfo">Remittance information</label>
        <textarea
          id="remittanceInfo"
          rows={2}
          value={form.remittanceInfo}
          onChange={(e) => update("remittanceInfo", e.target.value)}
          placeholder="Q3 coal supply for boiler operations"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        <div className="field">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.amount}
            onChange={(e) => update("amount", e.target.value)}
            placeholder="2000000"
          />
        </div>
        <div className="field">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            value={form.currency}
            onChange={(e) => update("currency", e.target.value)}
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? "Classifying with Gemini…" : "Submit transaction"}
      </button>
    </form>
  );
}

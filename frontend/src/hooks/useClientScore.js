import { useCallback, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient.js";

// Fetches the full client list (for the dashboard register).
export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/clients");
      setClients(res.data.clients);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { clients, loading, error, refresh };
}

// Fetches one client's profile plus their transactions.
export function useClientDetail(clientName) {
  const [client, setClient] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!clientName) return;
    setLoading(true);
    try {
      const [clientRes, txnRes] = await Promise.all([
        axiosClient.get(`/clients/${encodeURIComponent(clientName)}`),
        axiosClient.get(`/clients/${encodeURIComponent(clientName)}/transactions`),
      ]);
      setClient(clientRes.data.client);
      setTransactions(txnRes.data.transactions);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [clientName]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { client, transactions, loading, error, refresh };
}

// Fetches recent flagged anomalies across all clients.
export function useAnomalies() {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/anomalies");
      setAnomalies(res.data.anomalies);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { anomalies, loading, error, refresh };
}

import Client from "../models/Client.js";
import Transaction from "../models/Transaction.js";

/**
 * GET /api/clients
 * List all clients with their current running scores — powers the
 * main dashboard overview table/cards.
 */
export async function getAllClients(req, res, next) {
  try {
    const clients = await Client.find().sort({ "runningScore.overall": 1 });
    res.json({ count: clients.length, clients });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/clients/:clientName
 * Single client's full profile: running score, sector breakdown, history.
 */
export async function getClientByName(req, res, next) {
  try {
    const client = await Client.findOne({ clientName: req.params.clientName });
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.json({ client });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/clients/:clientName/transactions
 * All transactions for a given client — used by the client detail page.
 */
export async function getClientTransactions(req, res, next) {
  try {
    const transactions = await Transaction.find({
      clientName: req.params.clientName,
    }).sort({ createdAt: -1 });

    res.json({ count: transactions.length, transactions });
  } catch (err) {
    next(err);
  }
}

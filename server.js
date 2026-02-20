const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log("➡️ INCOMING:", req.method, req.url);
  next();
});

const TOKEN = process.env.CRYPTO_PAY_TOKEN;
const API_BASE = process.env.CRYPTO_PAY_API_BASE;

app.get("/", (req, res) => {
  res.send("SERVER WORKING");
});

// Создание инвойса
app.get("/test", async (req, res) => {
  try {
    const r = await fetch(`${API_BASE}/createInvoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Crypto-Pay-API-Token": TOKEN,
      },
      body: JSON.stringify({
        asset: "USDT",
        amount: "1",
        description: "Test payment",
        expires_in: 1800
      }),
    });

    const data = await r.json();

    if (!data.ok) {
      return res.json(data);
    }

    res.redirect(data.result.pay_url);

  } catch (err) {
    console.error(err);
    res.send("ERROR");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started"));

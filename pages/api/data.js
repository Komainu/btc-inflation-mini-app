import axios from "axios";

export default async function handler(req, res) {
  try {
    // CoinGecko から過去 90 日のビットコイン価格を取得
    const btcResponse = await axios.get(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart",
      { params: { vs_currency: "usd", days: 90 } }
    );

    // FRED (米国CPI) データ
    const fredApiKey = "YOUR_FRED_API_KEY"; // https://fred.stlouisfed.org/ で無料登録
    const cpiResponse = await axios.get(
      `https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=${fredApiKey}&file_type=json`
    );

    res.status(200).json({
      btc: btcResponse.data,
      cpi: cpiResponse.data.observations.slice(-90)
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

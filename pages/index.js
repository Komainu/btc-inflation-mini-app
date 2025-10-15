import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // BTC価格（CoinGecko）
        const btcRes = await axios.get(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart',
          { params: { vs_currency: 'usd', days: 90 } }
        );
        const btcData = btcRes.data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toISOString().split('T')[0],
          btc: price
        }));

        // 米国CPI（FRED APIなどが使えない環境ではダミーデータ）
        const cpiData = btcData.map((item, i) => ({
          ...item,
          cpi: 3 + Math.sin(i / 10) * 0.2 // 仮のCPI波形
        }));

        setData(cpiData);
        console.log(cpiData);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#111', color: '#fff', minHeight: '100vh', padding: '2rem' }}>
      <h2>ビットコインと米国CPIの90日間の推移</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" label={{ value: 'BTC/USD', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'CPI', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="btc" stroke="#FFD700" strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="cpi" stroke="#FF0000" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

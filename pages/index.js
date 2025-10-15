import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import axios from 'axios';

// ✅ rechartsはSSR非対応なのでdynamic importする
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // BTC価格（CoinGecko API）
        const btcRes = await axios.get(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart',
          { params: { vs_currency: 'usd', days: 90 } }
        );

        const btcData = btcRes.data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toISOString().split('T')[0],
          btc: price
        }));

        // CPI（仮データ）
        const cpiData = btcData.map((item, i) => ({
          ...item,
          cpi: 3 + Math.sin(i / 10) * 0.2
        }));

        setData(cpiData);
      } catch (err) {
        console.error('データ取得エラー:', err);
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
          <Line yAxisId="left" type="monotone" dataKey="btc" stroke="#FFD700" strokeWidth={2} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="cpi" stroke="#FF0000" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

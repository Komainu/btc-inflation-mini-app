import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

export default function Home() {
  const [btcData, setBtcData] = useState([]);
  const [cpiData, setCpiData] = useState([]);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => {
        const btcPrices = data.btc.prices.map(([time, price]) => ({
          date: new Date(time).toLocaleDateString(),
          price
        }));
        const cpiValues = data.cpi.map((item) => ({
          date: item.date,
          value: parseFloat(item.value)
        }));

        setBtcData(btcPrices);
        setCpiData(cpiValues);
      });
  }, []);

  const chartData = {
    labels: btcData.map((d) => d.date),
    datasets: [
      {
        label: "BTC/USD",
        data: btcData.map((d) => d.price),
        borderColor: "gold",
        yAxisID: "y1",
      },
      {
        label: "CPI (インフレ率)",
        data: cpiData.map((d) => d.value),
        borderColor: "red",
        yAxisID: "y2",
      }
    ]
  };

  const options = {
    scales: {
      y1: {
        type: "linear",
        position: "left",
        title: { display: true, text: "BTC/USD" },
      },
      y2: {
        type: "linear",
        position: "right",
        title: { display: true, text: "CPI" },
        grid: { drawOnChartArea: false },
      }
    }
  };

  return (
    <main style={{ padding: "2rem", background: "#111", color: "#fff", minHeight: "100vh" }}>
      <h1>📈 Bitcoin × インフレ率</h1>
      <p>ビットコインと米国CPIの90日間の推移</p>
      <div style={{ background: "#222", padding: "1rem", borderRadius: "10px" }}>
        <Line data={chartData} options={options} />
      </div>
    </main>
  );
}

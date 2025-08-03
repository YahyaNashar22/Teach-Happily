/* eslint-disable @typescript-eslint/no-explicit-any */
import "../css/Stats.css";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Stats = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(backend + "/user/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [backend]);

  if (loading || !stats)
    return <div className="stats-container">Loading stats...</div>;

  const courseTitles = stats.courseStats.map((c: any) => c.title);

  const courseClicksData = {
    labels: courseTitles,
    datasets: [
      {
        label: "Clicks",
        data: stats.courseStats.map((c: any) => c.clicks),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const coursePurchasesData = {
    labels: courseTitles,
    datasets: [
      {
        label: "Purchases",
        data: stats.courseStats.map((c: any) => c.purchases),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const courseCertificatesData = {
    labels: courseTitles,
    datasets: [
      {
        label: "Certificates",
        data: stats.courseStats.map((c: any) => c.certificateCount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const productPurchasesData = {
    labels: stats.productStats.map((p: any) => p.title),
    datasets: [
      {
        label: "Product Purchases",
        data: stats.productStats.map((p: any) => p.purchases),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const generalStatsData = {
    labels: ["Total Users", "Total Certificates"],
    datasets: [
      {
        data: [stats.totalUsers, stats.totalCertificates],
        backgroundColor: ["#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="stats-container">
      <h2 className="stats-title">Dashboard Statistics</h2>

      <div className="chart-section">
        <h3>General Stats</h3>
        <Doughnut data={generalStatsData} />
      </div>

      <div className="chart-section">
        <h3>Course Clicks</h3>
        <Bar data={courseClicksData} />
      </div>

      <div className="chart-section">
        <h3>Course Purchases</h3>
        <Bar data={coursePurchasesData} />
      </div>

      <div className="chart-section">
        <h3>Course Certificates</h3>
        <Bar data={courseCertificatesData} />
      </div>

      <div className="chart-section">
        <h3>Digital Product Purchases</h3>
        <Bar data={productPurchasesData} />
      </div>
    </div>
  );
};

export default Stats;

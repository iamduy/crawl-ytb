import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import './App.css';
import { calculateViewsDifference } from './utils';

function App() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const [dataYtb, setDataYtb] = useState([]);
  const [dataCrawl, setDataCrawl] = useState([]);


  useEffect(() => {
    async function executed() {
      const response = await fetch('http://localhost:8000/');
      const body = await response.text();
      const { data, dataYtb } = JSON.parse(body)
      setDataYtb(dataYtb);
      setDataCrawl(data);
    }
    executed();
  }, [])

  return (

    <Bar options={{
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Statistics views count Youtube',
        },
      },
    }}
      width={"1280px"}
      height={"640px"}
      data={{
        labels: calculateViewsDifference(dataCrawl).map(item => item.date),
        datasets: [
          {
            label: 'from HTML crawl',
            data: calculateViewsDifference(dataCrawl).map(item => item.viewCounts),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
          {
            label: 'from Googleapis',
            data: calculateViewsDifference(dataYtb).map(item => item.viewCounts),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      }}
    />
  )
}

export default App
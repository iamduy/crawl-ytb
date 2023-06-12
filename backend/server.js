import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cron from 'node-cron';
import fs from 'fs';
import request from 'request-promise';
import dayjs from 'dayjs';
import axios from 'axios';
const app = express();
dotenv.config();
app.use(cors());

app.get('/', (req, res) => {
  const jsonData = fs.readFileSync('data.json', 'utf8');
  const jsonDataYtb = fs.readFileSync('data-ytb.json', 'utf8');
  res.send({ data: JSON.parse(jsonData), dataYtb: JSON.parse(jsonDataYtb) });
});

const updateAPIYtbGoogleapis = () => {

  const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${"WRVsOCh907o"}&key=${process.env.API_KEY}`;
  axios.get(url)
    .then(response => {
      const oldData = JSON.parse(fs.readFileSync('data-ytb.json', 'utf8'));
      const viewCount = response.data.items[0].statistics.viewCount;
      const newData = {
        id: oldData.length + 1,
        viewCounts: viewCount,
        date: dayjs().format('YYYY-MM-DD HH:mm'),
      };
      const combinedData = [...oldData, newData];
      const jsonData = JSON.stringify(combinedData, null, 4);
      fs.writeFileSync('data-ytb.json', jsonData, 'utf8');
    })
    .catch(error => {
      console.error('Error retrieving view count:', error);
    });
}

const updateAPI = async () => {
  console.log('refresh data API !!!');
  try {
    const oldData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    const html = await request.get('https://www.youtube.com/watch?v=WRVsOCh907o');
    const regex = /([\d.,]+) lượt xem/g;
    const match = html.match(regex);
    const views = match[match.length - 1].replace(/\D/g, '');
    const newData = {
      id: oldData.length + 1,
      viewCounts: views,
      date: dayjs().format('YYYY-MM-DD HH:mm'),
    };
    const combinedData = [...oldData, newData];
    const jsonData = JSON.stringify(combinedData, null, 4);
    fs.writeFileSync('data.json', jsonData, 'utf8');
  } catch (error) {
    console.log(error);
  }
};

// 1 tiếng 1 lần
cron.schedule('0 * * * *', () => {
  updateAPIYtbGoogleapis();
  updateAPI();
});

// 1 phút 1 lần
// cron.schedule('* * * * *', () => {
//   updateAPI();
// });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('server is running!', PORT);
});

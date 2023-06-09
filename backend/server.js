import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cron from 'node-cron';
import fs from 'fs';
import request from 'request-promise';

const app = express();
dotenv.config();
app.use(cors());

app.get('/', (req, res) => {
  const jsonData = fs.readFileSync('data.json', 'utf8');
  res.send(jsonData);
});

const updateAPI = async () => {
  console.log('updated API');
  try {
    const oldData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    const html = await request.get('https://www.youtube.com/watch?v=CNhQjMGFLu4');
    const regex = /([\d.,]+) lượt xem/g;
    const match = html.match(regex);
    const views = match[match.length - 1].replace(/\D/g, '');
    const newData = {
      id: oldData.length + 1,
      viewCounts: views,
      date: Date.now(),
    };
    const combinedData = [...oldData, newData];
    const jsonData = JSON.stringify(combinedData, null, 4);
    fs.writeFileSync('data.json', jsonData, 'utf8');
  } catch (error) {
    console.log(error);
  }
};

cron.schedule('0 * * * *', () => {
  updateAPI();
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('server is running!', PORT);
});

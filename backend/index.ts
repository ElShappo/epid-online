import express, { Express, Request, Response } from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import * as XLSX from 'xlsx';
import { getMergedTablesData, getMergedRegionsName, getSubjectTree, getTotalPopulationPerAge, 
  getRuralToCityPopulationRatioPerAge, getWomenToMenRatioPerAge } from './utils/excel';
import { ChartDataset } from './types';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3003;

app.use(cors() );
app.use(express.json() );

const username = process.env.VALID_USERNAME;
const password = process.env.VALID_PASSWORD;

console.log(`Valid username: ${username}`);
console.log(`Valid password: ${password}`);

let workbook = XLSX.readFile('./files/Population2023.xlsx', {
  type: "file"
});

XLSX.writeFile(workbook, 'test.xlsx', {
  bookType: 'xlsx',
  type: 'file'
})

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/authorization', (req: Request, res: Response) => {
  console.log('Got: ');
  console.log(req.body);

  if (req.body.username === username && req.body.password === password) {
    return res.sendStatus(200);
  } else {
    return res.sendStatus(403);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});


app.get('/subjectTree', (req: Request, res: Response) => {
  let worksheet = workbook.Sheets[workbook.SheetNames[0]];
  res.send(getSubjectTree(worksheet) );
});

app.get('/subjects', async (req: Request, res: Response) => {
    let keys = req.query.key as string | string[]; // 2.1. corresponds to 'Центральный федеральный округ'
    console.log(`Initial keys: ${keys}`);

    const worksheets = [] as XLSX.WorkSheet[];

    // no keys, single key or multiple keys may be passed as query params
    // for simplicity we always want to treat this data as array
    if (!Array.isArray(keys) ) {
      keys = Array(keys);
    }

    // remove irrelevant keys
    // also make sure a user doesn't have access to 'Содержание' page
    // even if it was manually written in url
    keys = keys.filter((key) => workbook.SheetNames.includes(key) && key !== 'Содержание');

    // make sure at least one key is present after filtering
    if (keys.length === 0) {
      keys.push('2.1.');
    }

    console.log(`Modified keys: ${keys}`);

    for (let key of keys) {
      let worksheet = workbook.Sheets[key];
      worksheets.push(worksheet);
    }
    res.send(getMergedTablesData(worksheets) );
});

app.get('/populationPerAge', async (req: Request, res: Response) => {
    let keys = req.query.key as string | string[]; // 2.1. corresponds to 'Центральный федеральный округ'
    console.log(`Initial keys: ${keys}`);

    const worksheets = [] as XLSX.WorkSheet[];

    // no keys, single key or multiple keys may be passed as query params
    // for simplicity we always want to treat this data as array
    if (!Array.isArray(keys) ) {
      keys = Array(keys);
    }

    // remove irrelevant keys
    // also make sure a user doesn't have access to 'Содержание' page
    // even if it was manually written in url
    keys = keys.filter((key) => workbook.SheetNames.includes(key) && key !== 'Содержание');

    // make sure at least one key is present after filtering
    if (keys.length === 0) {
      keys.push('2.1.');
    }

    console.log(`Modified keys: ${keys}`);

    let worksheet = workbook.Sheets[keys[0]]; // multiple keys may be passed but we take only one (let it be the first key)
    res.send({
      data: getTotalPopulationPerAge(worksheet),
      label: getMergedRegionsName([worksheet])
    });
});

app.get('/ruralToCityRatioPerAge', async (req: Request, res: Response) => {
  let keys = req.query.key as string | string[]; // 2.1. corresponds to 'Центральный федеральный округ'
  console.log(`Initial keys: ${keys}`);

  const worksheets = [] as XLSX.WorkSheet[];

  // no keys, single key or multiple keys may be passed as query params
  // for simplicity we always want to treat this data as array
  if (!Array.isArray(keys) ) {
    keys = Array(keys);
  }

  // remove irrelevant keys
  // also make sure a user doesn't have access to 'Содержание' page
  // even if it was manually written in url
  keys = keys.filter((key) => workbook.SheetNames.includes(key) && key !== 'Содержание');

  // make sure at least one key is present after filtering
  if (keys.length === 0) {
    keys.push('2.1.');
  }

  console.log(`Modified keys: ${keys}`);

  let worksheet = workbook.Sheets[keys[0]]; // multiple keys may be passed but we take only one (let it be the first key)
  res.send({
    data: getRuralToCityPopulationRatioPerAge(worksheet),
    label: getMergedRegionsName([worksheet])
  });
});

app.get('/womenToMenRatioPerAge', async (req: Request, res: Response) => {
  let keys = req.query.key as string | string[]; // 2.1. corresponds to 'Центральный федеральный округ'
  console.log(`Initial keys: ${keys}`);

  const worksheets = [] as XLSX.WorkSheet[];

  // no keys, single key or multiple keys may be passed as query params
  // for simplicity we always want to treat this data as array
  if (!Array.isArray(keys) ) {
    keys = Array(keys);
  }

  // remove irrelevant keys
  // also make sure a user doesn't have access to 'Содержание' page
  // even if it was manually written in url
  keys = keys.filter((key) => workbook.SheetNames.includes(key) && key !== 'Содержание');

  // make sure at least one key is present after filtering
  if (keys.length === 0) {
    keys.push('2.1.');
  }

  console.log(`Modified keys: ${keys}`);

  let worksheet = workbook.Sheets[keys[0]]; // multiple keys may be passed but we take only one (let it be the first key)
  res.send({
    data: getWomenToMenRatioPerAge(worksheet),
    label: getMergedRegionsName([worksheet])
  });
});
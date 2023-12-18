import express, { Express, Request, Response } from 'express';
import fs from 'fs'
import cors from "cors";
import dotenv from 'dotenv';
import {PopulationSingleRecord} from './types'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3003;

app.use(cors() );
app.use(express.json() );

const username = process.env.VALID_USERNAME;
const password = process.env.VALID_PASSWORD;

console.log(`Valid username: ${username}`);
console.log(`Valid password: ${password}`);

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
  console.log(`Server is running at http://localhost:${port}`);
});

app.get('/regions', (req: Request, res: Response) => {
  const year = +(req.query.year as unknown as number)
  console.log('Year', year)
  console.log(typeof(year))
  const filename = './regions.json'
  const population = JSON.parse(fs.readFileSync('population.json', 'utf8'))

  if (!fs.existsSync(filename) ) {
    console.log('No cached file found. Extracting regions...')

    const regionsStringified = (population as PopulationSingleRecord[]).filter(row => row.year === year as unknown as number).map(row => {
      const obj = {
        territory: row.territory,
        territory_code: row.territory_code
      }
      return JSON.stringify(obj)
    })
    const regionsWithoutDuplicates = Array.from(new Set(regionsStringified))
    console.log(regionsWithoutDuplicates)
    const regions = regionsWithoutDuplicates.map(item => JSON.parse(item))

    fs.writeFileSync(filename, JSON.stringify(regions, null, 4))
    res.send(regions)

  } else {
    console.log('Using cached file...')

    const regions = fs.readFileSync(filename)
    res.send(regions)
  }
});
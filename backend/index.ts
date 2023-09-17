import express, { Express, Request, Response } from 'express';
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3003;

app.use(cors() );
app.use(express.json() );

const username = process.env.USERNAME;
const password = process.env.PASSWORD;

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

app.get('/subjects', (req: Request, res: Response) => {
    
})
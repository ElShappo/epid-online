import express, { Express, Request, Response } from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3002;

app.use(cors() );
app.use(express.json() );

const username = 'root';
const password = '1234';

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

app.get('/federalSubjects', (req: Request, res: Response) => {
    
})
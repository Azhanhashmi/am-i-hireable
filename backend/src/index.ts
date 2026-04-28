import express from 'express'
import cors from 'cors'
import { config } from './config/env'
import analyzeRouter from './routes/analyze';

const app = express()

app.use(cors())
app.use(express.json())
app.get("/health",(req,res)=>{
    res.status(200).json({status:"ok"})
})

app.use('/api/analyze', analyzeRouter);
console.log('Routes mounted');

app.post('/test', (req, res) => {
  console.log('TEST HIT', req.body);
  res.json({ ok: true });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
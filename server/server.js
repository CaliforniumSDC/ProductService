const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res)=>{
  res.send('Hello World, you luck');
})

app.get('/products', (req, res)=>{
  let page = req.params.page || 1;
  let count = req.params.count || 5;

  res.send('Hello World, you luck');
})

app.listen(port, ()=>{
  console.log(`Product API listening on port http://localhost:${port}`)
})


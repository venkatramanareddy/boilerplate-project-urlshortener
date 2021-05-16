require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser')
var backend = require('./backend')

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (e) {
    console.log(e)
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

app.post('/api/shorturl', function(req, res){
  const url= req.body.url;
  if(!isValidHttpUrl(url)){
    res.json({ error: 'Invalid URL' })
    return;
  }
  backend.saveURL(url, function(err, data){
    if(err) res.json({status: err})
    res.json({
      short_url: data._id,
      original_url: data.url
    });
  });
})

app.use('/api/shorturl/:id', function(req, res){
  let resp = backend.findURLfromID(req.params.id, function(err, data){
    if(err) res.json({status: err});
    res.redirect(data.url)
  })
  // need to redirect to final site
  // res.send(req.params.id);
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

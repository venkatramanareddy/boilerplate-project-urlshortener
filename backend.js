require('dotenv').config();
const mongoose = require('mongoose')
const Schema  = mongoose.Schema;

// const mySecret = process.env['MONGO_URI']

// console.log(`mongo uri: ${process.env.MONGO_URI} ${mySecret}`)

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const URLSchema = new Schema({
  url: {
    type: String,
    required: true
  }
});

const URLShortener = mongoose.model('URLShortener', URLSchema)

// returns saved object
const saveURL = (url, done) => {
  let urlEntry = new URLShortener({
    url: url
  });
  urlEntry.save(function(err, data){
    if(err) return done(err);
    return done(null, data);
  })
}

function findURLfromID(id, done){
  URLShortener.findById({
    _id: id
  }, function(err, data){
    if(err) return done(err);
    return done(null, data);
  })
}

exports.saveURL = saveURL;
exports.findURLfromID = findURLfromID;

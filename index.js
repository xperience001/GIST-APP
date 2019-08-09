const express = require('express');
const app = express();
const PORT = process.env.PORT || 2500
const mongoose = require('mongoose');
const mongodbString = 'mongodb://localhost:27017/new-gist';
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./route/post');
const path = require('path');
const multer = require('multer');


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'))

// HANDLING CORS ERRORS
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if(req.method === 'OPTIONS'){
    res.headers('Access Controll-Allow-Mthods', 'POST, PUT, GET, DELETE');
    return res.status(200).json({})
    }
    next();
    })

app.use(router);

mongoose.promise = global.promise
mongoose.connect(mongodbString, {useNewUrlParser: true})
.then((db)=>{
    console.log('mongodb connected')
}).catch((err)=>{
    console.log('mongo error', err)
})

// MULTER
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    console.log(file)
    cb(null, file.originalname)
  }
})


app.post('/upload', (req, res, next) => {
    const upload = multer({ storage }).single('name-of-input-key')
    upload(req, res, function(err) {
      if (err) {
        return res.send(err)
      }
      console.log('file uploaded to server')
      console.log(req.file)
  
    // SEND FILE TO CLOUDINARY
    const cloudinary = require('cloudinary').v2
    cloudinary.config({
    cloud_name:	process.env.CLOUDNAME,
    api_key:	process.env.APIKEY,
    api_secret: process.env.APISECRET
    });
      
      const path = req.file.path
      const uniqueFilename = new Date().toISOString()
  
      cloudinary.uploader.upload(
        path,
        { public_id: `blog/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
        function(err, image) {
          if (err) return res.send(err)
          console.log('file uploaded to Cloudinary')
          // remove file from server
          const fs = require('fs')
          fs.unlinkSync(path)
          // return image details
          res.json(image)
        }
      )
    })
  })

app.listen(PORT, ()=>{
    console.log(`app is listening on ${PORT}`)
})
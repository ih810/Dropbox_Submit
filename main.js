const express = require("express");
const fs = require("fs");
const fileUpload = require("express-fileupload");
//ejs could be used on rs.render for future functionallity
const ejs = require("ejs");

const cache = {}

const app = express();

app.use(express.json());

//function to store file name in an array
const updateForm = () => {
  console.log("update updateForm");

  //using promise to manage the flow
  return new Promise((resolve, reject) => {
    fs.readdir(__dirname + "/storage", (err, files) => {
      if (err) {
        reject(err);
      } else {
        //after readdir, output the file into .then
        console.log(files);
        resolve(files);
      }
    });
  });
};

//setup fileUpload
app.use(fileUpload());

//this is requested from append.js
app.get("/update", (req, res) => {
  //send files to the frontend after readdir
  updateForm().then((files) => {
    res.send(files);
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + `/pages/index.html`);
});

app.get("/style.css", (req, res) => {
  res.sendFile(__dirname + `/pages/style.css`);
});

app.get("/append.js", (req, res) => {
  res.sendFile(__dirname + `/pages/append.js`);
});

app.get("/storage/:file", (req, res) => {
  res.download(`storage/${req.params.file}`);
});

app.get("/preview/:file", (req, res)=>{
  res.sendFile(__dirname + `/storage/${req.params.file}`)
})

app.post("/fileupload", (req, res) => {
  let uploadedFile;
  let uploadPath;

  //error handling
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files");
  }
  console.log(req.files);

  //set up route
  uploadedFile = req.files.filetoupload;
  uploadPath = __dirname + "/storage/" + uploadedFile.name;

  //place the uploaded file into target folder
  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      //err handling
      return res.status(500).send(err);
    }
  });

  updateForm().then(() => {
    res.redirect("/");
  });
});

app.get("/del/:file", (req, res) => {
  fs.unlinkSync(__dirname + `/storage/${req.params.file}`, (err) => {
    console.log(err);
  });
  updateForm().then(() => {
    res.redirect("/");
  });
});

app.listen(8080, () => {
  console.log(`listen 8080`);
});

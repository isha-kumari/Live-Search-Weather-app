const express = require('express');
const fs = require('fs');
const requests = require('requests');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.urlencoded({extended:true}))
//get all data of home.html file in homeFile
const homeFile = fs.readFileSync('home.html', 'utf-8');

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace('36.4', orgVal.main.temp);
  temperature = temperature.replace('36.4', orgVal.main.temp_min);
  temperature = temperature.replace('36.4', orgVal.main.temp_max);
  temperature = temperature.replace('Patna', orgVal.name);
  temperature = temperature.replace('India', orgVal.sys.country);
  temperature = temperature.replace('Sun-ny', orgVal.weather[0].main);
  return temperature;
};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/home.html");
});

app.post("/", (req, res)=>{
  var place = req.body.place;
  if (req.url == '/') {
    requests(
      'https://api.openweathermap.org/data/2.5/weather?q='+place+'&appid=face7e454ef83d65f6348d91448c90a9&units=metric'
    )
      .on('data', (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        //console.log(arrData);

        //now replace placeholder value in home.html with real time data i.e., arrData temp and location val
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join('');
        res.write(realTimeData);
      })
      .on('end', (err) => {
        if (err) return console.log('connection closed due to errors', err);

        res.end();
      });
  }
})

app.listen(7100, '127.0.0.1');

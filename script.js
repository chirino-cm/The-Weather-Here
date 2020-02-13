// Express routing and nedb database
const express = require('express');
const Datastore = require('nedb');
// make fetch available in node
const fetch = require('node-fetch');
// make dotenv available (environmental variables)
require('dotenv').config();

// Listening in Port 3000
const app = express();
app.listen(3000, console.log('listening at 3000'));
// Hosting Static Pages in "public"
app.use(express.static('public'));
// Parses incomming request with json
app.use(express.json({limit: '1mb' }));

// Establishes database name and loads it
let database = new Datastore('database.db');
database.loadDatabase();


// Receives data with POST
app.post('/api', (request, response) => {
    console.log('i received data!');
    console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
    
});

// Receives request with GET 

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            console.error('error!')
            return;
        }
        response.json(data)

    }
)});


// Receives request for weather/air_quality information with the latitude and longitude of the client
app.get('/weather/:latlon', async (request, response) => {
    const [ lat, lon ] = request.params.latlon.split(",");
    //ENVIRONMENTAL VARIABLE
    const api_key = process.env.API_KEY;
    const w_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}/?units=si&exclude=hourly,daily,flags`;
    const w_resp = await fetch(w_url);
    const w_data = await w_resp.json();
    
    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const aq_resp = await fetch(aq_url);
    const aq_data = await aq_resp.json();
    
    const data = {
        weather: w_data,
        air_quality: aq_data
    }
    
    response.json(data);

});


const tbody = document.getElementById("tbody");

function buildTable(data) {
    for (item of data) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        const td4 = document.createElement("td");
        const td5 = document.createElement("td");
        const td6 = document.createElement("td");
        const td7 = document.createElement("td");

        const weather = item.weather;
        const air = item.air_q;
                

        td1.textContent = item.lat.toFixed(2) + "°";
        td2.textContent = item.lon.toFixed(2) + "°";
        td3.textContent = weather.timezone;
        td4.textContent = weather.time;
        td5.textContent = weather.summary;
        td6.textContent = weather.temperature + "°C";
        td7.textContent = air.airQuality;
        
        tr.append(td1, td2, td3, td4, td5, td6, td7);
        
        
        tbody.appendChild(tr);    

    }   
}
async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    buildTable(data);
    locateInMap(data);
}


//Making a map and tiles
const mymap = L.map('my-map').setView([0, 0], 1);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution } );
tiles.addTo(mymap);


function locateInMap(data) {
    console.log(data);
    for (item of data) {
        const { lat, lon } = item;
        const { timezone, summary, temperature, time } = item.weather;
        
        const marker = L.marker([lat, lon]).addTo(mymap);
        const popup_text = `Weather Info for ${timezone} : ${summary}, ${temperature}°C (${time}). Air quality info: ${item.air_q.airQuality}`;
        
        marker.bindPopup(popup_text);
    }
}

getData();

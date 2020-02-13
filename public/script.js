const btn = document.getElementById("submit");
const wt = document.getElementById("weather-table");

let lat = 0;
let lon = 0;
let weather = {};
let air_q = {};

function buildTable(info) {
  //Values for the table
  const timezone = info.weather.timezone;
  let { summary, temperature } = info.weather.currently;
  const dateString = Date(Date.now()).toString().split(" ");
  dateString.splice(5, dateString.length - 5);
  let time = dateString.join(" ");
  weather = { timezone, summary, temperature, time };
  
  
  const table = document.createElement("table");
  
  const tr1 = document.createElement("tr");
  const th1 = document.createElement("th");
  th1.textContent= "Timezone"
  const td1 = document.createElement("td");
  td1.textContent = timezone;
  tr1.append(th1, td1);

  const tr2 = document.createElement("tr");
  const th2 = document.createElement("th");
  th2.textContent= "Time"
  const td2 = document.createElement("td");
  td2.textContent = time;
  tr2.append(th2, td2);

  const tr3 = document.createElement("tr");
  const th3 = document.createElement("th");
  th3.textContent= "Summary"
  const td3 = document.createElement("td");
  td3.textContent = summary;
  tr3.append(th3, td3);

  const tr4 = document.createElement("tr");
  const th4 = document.createElement("th");
  th4.textContent= "Temperature"
  const td4 = document.createElement("td");
  td4.textContent = temperature + "°C";
  tr4.append(th4, td4);
  // Air Quality
  if (info.air_quality.results.length > 0) {
    const air = info.air_quality.results[0].measurements;
    air_q = { 
        airQuality: `${air[0].parameter}: ${air[0].value}${air[0].unit} 
        ${air[1].parameter}: ${air[1].value}${air[1].unit}`
      };
  } else {
    air_q = { airQuality : 'No air quality reading' };
  }    
  const tr5 = document.createElement("tr");
  const th5 = document.createElement("th");
  th5.textContent= 'air quality';
  const td5 = document.createElement("td");
  td5.textContent = air_q.airQuality;
  tr5.append(th5, td5);  
    
    
  
  table.append(tr1, tr2, tr3, tr4, tr5);
  wt.appendChild(table);


}

if ("geolocation" in navigator) {
    console.log('geolocation is available');
    navigator.geolocation.getCurrentPosition(async position => {
        try {
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          document.getElementById('lat').textContent = lat.toFixed(2);
          document.getElementById('lon').textContent = lon.toFixed(2);
          
          //requesting weather info for client location
          const api_url = `weather/${lat},${lon}`;
          const response = await fetch(api_url);
          const json = await response.json();
          console.log(json);
          buildTable(json);
        } catch (err) {
          console.error('Something went wrong: ' + err)
        }

        
        
    });

  } else {
    console.log('geolocation IS NOT available');
}


async function submitData() {
  const data = { lat, lon, weather, air_q };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
      
  }
  const resp = await fetch('/api', options);
  const jsonData = await resp.json();
  console.log(jsonData);

}  

btn.addEventListener('click', submitData);

  






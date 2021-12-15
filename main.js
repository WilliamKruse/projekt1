const express = require('express')
const { Client } =  require("pg");
const app = express()

const api_port = process.env.PORT || 5000;
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_PW = process.env.DB_PW;
const DB_PORT = process.env.DB_PORT || 5432;

const client = new Client({ 
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PW,
    port: DB_PORT
});
client.connect();

app.use(express.static("public"))
app.get("/foodbarchart", async (req, res) => {
  console.log("start");
  
  try {
    // Lav query
    const qry = 'select sector, sum(tons_supply) AS supply, (sum(tons_surplus)' +
    ' + sum(tons_waste) + sum(tons_uneaten) + sum(tons_composted) + sum(tons_anaerobically_digested)' +
    ' + sum(tons_animal_feed)' +
    ' + sum(tons_industrial_uses)' +
    ' + sum(tons_not_harvested)' +
    ' + sum(tons_incineration)' +
    ' + sum(tons_land_application)' +
    ' + sum(tons_landfilled)' +
    ' + sum(tons_dumping)' +
    ' + sum(tons_sewer))/sum(tons_supply)*100 AS procent_wasted,  ROUND((sum(tons_surplus) + sum(tons_waste) + sum(tons_uneaten)' +
    ' + sum(tons_composted) + sum(tons_anaerobically_digested) + sum(tons_animal_feed) + sum(tons_industrial_uses)' +
    ' + sum(tons_not_harvested) + sum(tons_incineration) + sum(tons_land_application)+ sum(tons_landfilled)+ sum(tons_dumping)' +
    ' + sum(tons_sewer))/sum(tons_supply) * sum(tons_supply)) AS tons_wasted from food_data where year = 2019 GROUP BY sector ORDER BY tons_wasted DESC ' 


    queryData = await client.query(qry);


    // Giv svar tilbage til JavaScript
    res.json({
      "ok": true,
      "data": queryData.rows,
    })
  } catch (error) {
    // Hvis query fejler, fanges det her.
    // Send fejlbesked tilbage til JavaScript
    res.json({
      "ok": false,
      "message": error.message,
    }) 
  }

});

// Web-serveren startes.
app.listen(api_port, () => {
  console.log(`Appl. lytter på http://localhost:${api_port}`)
})
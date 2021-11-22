const express = require("express")
const app = express()
const port = 3000

const { Client } = require("pg");
const client = new Client({
  user: "yuryrofq", // Brug din egen bruger her
  host: "ella.db.elephantsql.com", // Brug din egen Server her 
  database: "yuryrofq", // Din kalorie database 
  password: "T4RiGNq-HM-JCLq8rKJLWLevOpUElOgw", // Dit password i skyen. 
  port: 5432
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
app.listen(port, () => console.log(`Serveren kører på http://localhost:${port}`));

//let spiral = d3.xml("spiral.svg")
// .then(data => {
//    d3.select("#boks").node().append(data.documentElement)
//  });
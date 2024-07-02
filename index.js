const express = require("express")
const app = express()
const axios = require("axios")
require("dotenv").config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", true);

app.get("/", (req,res) => {
    res.send("Welcome to my server")
})

app.get("/api/hello", async (req, res) => {
    const visitorName = req.query.visitor_name || "Guest";
    const ipAddr = req.ip;

    try {
        const apiResponse = await axios.get( "http://api.weatherapi.com/v1/current.json", {
        params: {
        key: process.env.apiKey,
        q: ipAddr,
        aqi: "no"
        }});
        
        const clientLocation = apiResponse.data.location.name 
        const temperature = apiResponse.data.current.temp_c
        
        res.status(200).json({
              client_ip: ipAddr,
              location: clientLocation,
              greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celcius in ${clientLocation}`,});
        
        } catch (err) {
        res.status(500).json({
              error: err,
              msg: "Something went wrong!",
        });
        }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
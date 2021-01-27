require("dotenv").default()
const express = require("express");
const fetch = require("node-fetch")
const app = express();
let port = '5000';
let domain = 'localhost';
app.set("view engine", "ejs")
app.use(express.static("public"))
async function getInfo(movieName, year){
    const API_KEY = process.env.API_KEY;
    let url = `https://www.omdbapi.com/?t=${movieName}${year!=''?('&y='+year):''}&apikey=${API_KEY}`
    console.log(url)
    let response = await fetch(url)
    let data = await response.json()
    return data
}
app.listen(port, () => {
    console.log(`Listening at ${domain}:${port}`)
})
app.get('/', (req, res)=>{
    res.sendFile('./views/index.html', {root: __dirname})
});
app.get('/request', (req, res)=> {
    movieData = getInfo(req.query.name, req.query.year)
    movieData.then(result => {
        const miniResult = {Title: result.Title, Plot:result.Plot, Poster: result.Poster, Year: result.Year}
        res.render('result', {data: miniResult, name: req.query.name, year: req.query.year})
        // console.log(result)
    }).catch((err) => {
        console.err(err)
        res.sendFile('./views/index.html', {root: __dirname})
    })
})
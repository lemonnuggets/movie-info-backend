require("dotenv").default()
const express = require("express");
const fetch = require("node-fetch")
const app = express();
let port = '5000';
let url = 'localhost';
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
    console.log(`Listening at ${url}:${port}`)
})
app.get('/', (req, res)=>{
    res.sendFile('./views/index.html', {root: __dirname})
});
app.get('/request', (req, res)=> {
    movieData = getInfo(req.query.name, req.query.year)
    movieData.then(result => {
        mini_result = {Title: result.Title, Plot:result.Plot, Poster: result.Poster, Year: result.Year}
        res.render('result', {data: mini_result, name: req.query.name, year: req.query.year})
        // console.log(result)
    }).catch((err) => {
        console.err(err)
        res.sendFile('./views/index.html', {root: __dirname})
    })
})
'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());


//monogdb connection
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/pocki', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.MONGOURL, {useNewUrlParser: true, useUnifiedTopology: true});


//schema
const pockiSchema = new mongoose.Schema({
    name: String,
    url: String
  });

//model
const pockiModel = mongoose.model('pocki', pockiSchema);


//Routes
app.get('/all',allDataHandler);
app.post('/addToFav',addToFavHandler);
app.get('/getFav',getFavDataHandler);
app.delete('/deletFav',deleteFavHandler);
app.put('/updateFav',updateFavHandler);

//Hendlers
function allDataHandler(req,res){

    const url = `https://pokeapi.co/api/v2/pokemon`;
    axios
    .get(url)
    .then(result=>{
        res.send(result.data.results);
    })
}

function addToFavHandler(req,res){
    // console.log(req.body);
    const {name,url} = req.body;
    const item = new pockiModel({
        name: name,
        url: url
    })

    item.save();

}

function getFavDataHandler(req,res){
    pockiModel.find({},(err,data) =>{
        res.send(data);
    })
}

function deleteFavHandler(req,res){
    const id = req.query.id;
    pockiModel.deleteOne({_id:id},(err,data)=>{
        pockiModel.find({},(err,data) =>{
            res.send(data);
        })
    })
}

function updateFavHandler(req,res){
    // console.log(req.body);
    const {name,url,id} = req.body;
    pockiModel.find({_id:id},(err,data)=>{
        data[0].name = name;
        data[0].url = url;
        data[0].save()
        .then(()=>{
            pockiModel.find({},(err,data) =>{
                res.send(data);
            })
        })
        
    })
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
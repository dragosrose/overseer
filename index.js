import {con} from './db_connection.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import  Express  from 'express';
const app = Express();
const port = 3000;
//import notes from ('../controllers/note.controller.js');
// const dotenv = require('dotenv');
// const  collectionsContracts =  require('./collectionsContracts.json')
// const Web3 = require("web3")
// const hdwalletprovider = require("hdwalletprovider")
// const opensea = require("opensea-js");
// const OpenSeaPort = opensea.OpenSeaPort;
// const Network = opensea.Network;

dotenv.config();
const COVALENT_KEY = process.env.COVALENT_KEY;
const OPENSEA_KEY = process.env.OPENSEA_KEY;


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

app.post('/GetWhaleByContractAddress', (req, res) => {
  var sql = "SELECT * FROM nft_collection where contract_address = '"+ req.body.contract_address +"'";
  con.query(sql, function (err, result) {
     if (err) throw err;
     var sql2 = "SELECT SUM(token_best_bid),COUNT(id), token_owner FROM tokens where collection_id = "+result[0]['id']+" GROUP BY token_owner order  by COUNT(id) desc;"
     con.query(sql2, function (err, result2) {
        if (err) throw err;
        let list = [];
        for(let i = 0; i< result2.length; i++)
        {
          
            if(result2[i]['COUNT(id)'] >=10 && result2[i]['SUM(token_best_bid)'] >=50)
            {
                
                list.push({whale_address: result2[i]['token_owner'], nft_number: result2[i]['COUNT(id)'], nfts_sum: result2[i]['SUM(token_best_bid)']})
            }
           
        }
        res.json(list);
        
     }); 
     
  });

});

app.post('/GetTransactionByID', (req, res) => {
  //console.log(req);
  if(req.body.id == undefined)
  {
    res.status(400).json('Missing id');
  }
  else{
  var sql = "SELECT * FROM nft_collection where contract_address = '"+ req.body.contract_address +"'";
  con.query(sql, function (err, result) {
     if (err) throw err;
     var sql2= "SELECT * FROM tokens where token_id = "+ req.body.id +" and collection_id = "+ result[0]["id"] +"";
     con.query(sql2, function (err, result2) {
         if (err) throw err;
         var sql3 = "SELECT * FROM transactions where token_id = "+ result2[0]['id'] +"";
         con.query(sql3, function (err, result3) {
             if (err) throw err;
             res.json(result3);
             
         });
     });
  });  }

});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

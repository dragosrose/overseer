//const express = require('express');
//const app = express();
//const port = 3000;
//const dotenv = require('dotenv');
//const  collectionsContracts =  require('./collectionsContracts.json')
// const Web3 = require("web3")
// const hdwalletprovider = require("hdwalletprovider")
// const opensea = require("opensea-js");
// const OpenSeaPort = opensea.OpenSeaPort;
// const Network = opensea.Network;



// dotenv.config();
// const COVALENT_KEY = process.env.COVALENT_KEY;
// const OPENSEA_KEY = process.env.OPENSEA_KEY;

// const provider =new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/f262e1f29cb94550b1531fac6910505c')


// const seaport = new OpenSeaPort(provider, {
//   networkName: Network.Main,
//   apiKey: OPENSEA_KEY
//},(arg) => console.log(arg))

// console.log(seaport);

// const assetPromise =  seaport.api.getAsset({
//   tokenAddress: '0x3F1d193884Fd596e2B2110759F314118Af410CED',
//   tokenId: '4398',
// })
// assetPromise.then(asset => {
//   console.log(asset.description);})





//TEST PENTRU CONECTAREA LA OPENSEA STREAM API

 import { OpenSeaStreamClient } from '@opensea/stream-js';
 import { EventType } from '@opensea/stream-js';
 import { WebSocket } from 'ws';
  
const client = new OpenSeaStreamClient({
   token: process.env.OPENSEA_KEY,
   connectOptions: {
      transport: WebSocket
    }
});

client.onEvents(
  '*',
  [EventType.ITEM_RECEIVED_OFFER, EventType.ITEM_TRANSFERRED],
  (event) => {
    console.log(event);
  }
);

// client.onItemListed('*', (event) => {
//   console.log("====================================")
//   console.log(event);
// });
// client.onItemCancelled('*', (event) =>{
//   console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
//   console.log(event);
// });


// client.onItemListed(['doodles-official','ainightbirds','boredapeyachtclub','goblintownwtf'], (event) => {
//   console.log(event);
// });

import BigNumber from 'big-number/big-number.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';



dotenv.config();
const OPENSEA_KEY = process.env.OPENSEA_KEY;

const options = {
   method: 'GET',
   headers: {Accept:'application/json', 'X-API-KEY': OPENSEA_KEY},
}

export async function getPrice(token_id, contract_address) {
  
  var url = 'https://api.opensea.io/api/v1/events?token_id='+ token_id +'&asset_contract_address='+contract_address;
  const response = await fetch(url,options);
  const data = await response.json();
  let  lastPrice = new BigNumber(0);
  let maxBid = new BigNumber(0);

  for(let i = 0; i < data['asset_events'].length; i++)
   {
      
      if(data['asset_events'][i]['event_type'] == 'successful')
      {
         
         lastPrice = new BigNumber(data['asset_events'][i]['total_price']);
         
      } 
      else if(data['asset_events'][i]['event_type'] == 'bid_entered' || data['asset_events'][i]['event_type'] == 'offer_entered')
      {
        if(new BigNumber(data['asset_events'][i]['bid_amount']).gt(maxBid))
        {
           maxBid = BigNumber(data['asset_events'][i]['bid_amount']);
        }

      }
   }
   let l = [];
   l.push(BigNumber(lastPrice).toString());
   l.push(BigNumber(maxBid).toString());
   return l;
   
   
}

// getPrice(0, '0xed5af388653567af2f388e6224dc7c4b3241c544').then(function(result) {
//    console.log(result);
// });




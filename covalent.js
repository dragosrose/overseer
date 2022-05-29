const https = require("https");
const fs = require("fs");
var BigNumber = require("bignumber.js");
var mysql = require("mysql");


const URL_CONTRACT_TOKENS =
  "https://api.covalenthq.com/v1/1/tokens/0xe4605d46fd0b3f8329d936a8b258d69276cba264/nft_token_ids/?key=ckey_a0ec30e6d6aa4f2e8227de3767d";

const URL_TOKEN_TRANSACTIONS = "https://api.covalenthq.com/v1/1/tokens/0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB/nft_transactions/2928/?quote-currency=USD&format=JSON&key=ckey_a0ec30e6d6aa4f2e8227de3767d"

//creare conexiune la baza de date
var con = mysql.createConnection({
  host: "localhost",
  database: "nft_db",
  user: "",
  password: "",
});





//functie pentru a obtine token id pentru un contract
console.log("===");
https.get(URL_CONTRACT_TOKENS, (resp) => {
  let data = '';

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {

    var x = JSON.parse(data);
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        for(let i =0; i< x["data"]["items"].length;i++)
        {
    
            var token_id = x["data"]["items"][i]["token_id"];
            var sql = "INSERT INTO tokens (token_id, collection_id) VALUES ("+ token_id +" ," + 2 +" )";
            con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(i +" record inserted");
            });
        }
      });
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
console.log("==")

//functie pentru a obtine token transactions
//conectarea la baza de date

con.connect(function(err) {
  //if (err) throw err;
  console.log("Connected!");

for(let index = 2; index<100;index++){
const URL = "https://api.covalenthq.com/v1/1/tokens/0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB/nft_transactions/"+index+"/?quote-currency=USD&format=JSON&key=ckey_a0ec30e6d6aa4f2e8227de3767d"
https.get(URL, (resp) => {
  let data = '';

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    
      var recv = JSON.parse(data);
     
                
              
      for(let x =0; x < recv["data"]["items"][0]["nft_transactions"].length;x++)
      {
        
        for(let  i = 0; i< recv["data"]["items"][0]["nft_transactions"][x]["log_events"].length;i++)
        {
          let obj = recv["data"]["items"][0]["nft_transactions"][x]["log_events"][i]["decoded"];
          if(obj == null)
          {  console.log(index);}
         
          else if(obj["name"] == "Transfer" && (obj["params"][2]["value"]==null || obj["params"][2]["value"] < 2))
          {
            var token_id = index ;
            var from_address = obj["params"][0]["value"]
            var to_address = obj["params"][1]["value"]
            if(x == 0 )
            {
              var sql = "UPDATE tokens SET token_owner = '"+ to_address +"' WHERE token_id = "+token_id +";";
              
              con.query(sql, function (err, result) {
                if (err) throw err;
                console.log(index +" token owner updated");
               });
            }
            
            var sql = "INSERT INTO transactions (from_address, to_address, token_id) VALUES ('"+ from_address +"' ,'" + to_address +"' ,"+ token_id+" )";
            con.query(sql, function (err, result) {
             if (err) throw err;
             console.log(index +" record inserted");
            });
           
           // break;
          }
          
        }
      }
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

}
});


console.log("==");
//doar o functie care sa afiseze in fisirele json spatiat obiecte de tip json
// function JSONstringify(json) {
//   if (typeof json != "string") {
//     json = JSON.stringify(json, undefined, "\t");
//   }

//   var arr = [],
//     _string = "color:green",
//     _number = "color:darkorange",
//     _boolean = "color:blue",
//     _null = "color:magenta",
//     _key = "color:red";

//   json = json.replace(
//     /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
//     function (match) {
//       var style = _number;
//       if (/^"/.test(match)) {
//         if (/:$/.test(match)) {
//           style = _key;
//         } else {
//           style = _string;
//         }
//       } else if (/true|false/.test(match)) {
//         style = _boolean;
//       } else if (/null/.test(match)) {
//         style = _null;
//       }
//       arr.push(style);
//       arr.push("");
//       return match;
//     }
//   );

//   arr.unshift(json);

//   return json;
//   //console.log.apply(console, arr);
// };

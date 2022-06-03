import { getTransaction } from "./getTransactionForNft.js";
import {con} from "./db_connection.js";
import {getPrice} from "./getPriceForNft.js";
import  schedule  from "node-schedule";
import util from "util";
import BigNumber from 'big-number/big-number.js';


const contract_address = '0x77640cf3f89a4f1b5ca3a1e5c87f3f5b12ebf87e';
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
const stop = 3333;
async function getData(contract_address) {

   // getNftCollection(contract_address);
    // for(let index = 0; index<stop;index++)
    // {
    //       getNftTransaction(index, contract_address); 
    // }
    let i = -1 ;
    const job = schedule.scheduleJob({  rule: '*/1 * * * * *' }, function(){
        
        i++;
        if(i<=1800)
        {
          getNftPrice(i, contract_address);        
           
        }
        else
        {
            job.cancel();
        }
    });


   
}
getData(contract_address);

async function getNftCollection(contract_address) {
   
    var sql = "SELECT * FROM nft_collection where contract_address = '"+ contract_address +"'";
    con.query(sql, function (err, result) {
        if (err) throw err;
    
        //console.log(result);
        const tokens_number = result[0]["tokens_number"];
        const collection_id = result[0]["id"];

        for(let i = 0; i<tokens_number;i++)
        {

            var xsql = "INSERT INTO tokens (token_id, collection_id) VALUES ("+ i +" ," + collection_id +" )";
            con.query(xsql, function (err, result) {
                if (err) throw err;
                console.log(i +" record inserted");
                
            });
        }
    });

    
}


async function getNftTransaction(token_id, contract_address) {

    await   getTransaction(token_id, contract_address).then(function(resultTransaction){
        const x =  resultTransaction.length;
        for(let i = 0; i< x-1;i+=2)
        {
            let from = resultTransaction[i];
            let to = resultTransaction[i+1];
            
            var sql = "SELECT * FROM nft_collection where contract_address = '"+ contract_address +"'";
            con.query(sql, function (err, result) {
               if (err) throw err;
               var sql2= "SELECT * FROM tokens where token_id = "+ token_id +" and collection_id = "+ result[0]["id"] +"";
               con.query(sql2, function (err, result2) {
                   if (err) throw err;
                  // console.log(result2[0]['id']);
                   var sql3 = "INSERT INTO transactions (from_address, to_address, token_id) VALUES('"+from+"' , '"+to+"' , "+ result2[0]['id']+ ");";
                   con.query(sql3, function (err, result3) {
                       if (err) throw err;
                       console.log(from= " +  to= "+to+" record inserted");
                   });
               });
            });
        console.log(from + "  "+ to);
            
        }
        console.log("=========================")

         var sql = "SELECT * FROM nft_collection where contract_address = '"+ contract_address +"'";
         con.query(sql, function (err, result) {
            if (err) throw err;
            var sql2= "SELECT * FROM tokens where token_id = "+ token_id +" and collection_id = "+ result[0]["id"] +"";
            con.query(sql2, function (err, result2) {
                if (err) throw err;
                //console.log(result2[0]['id']);
                var sql3 = "UPDATE tokens SET token_owner ='"+ resultTransaction[x-1] +"' where id = "+ result2[0]['id'] +";";
                con.query(sql3, function (err, result3) {
                    if (err) throw err;
                    console.log(resultTransaction[x -1] +" record inserted");
                });
            });
      
                    
        });
        
        
    });
}
async function getNftPrice(token_id, contract_address) {

    await getPrice(token_id, contract_address).then(function(resultPrice){
        var sql = "SELECT * FROM nft_collection where contract_address = '"+ contract_address +"'";
        con.query(sql, function (err, result) {
           if (err) throw err;
           var sql2= "SELECT * FROM tokens where token_id = "+ token_id +" and collection_id = "+ result[0]["id"] +"";
           con.query(sql2, function (err, result2) {
               if (err) throw err;
               const x = parseFloat(resultPrice[0])/parseFloat(10**18);
               const y = parseFloat(resultPrice[1])/parseFloat(10**18);
               var sql = "UPDATE tokens SET token_last_sell_price = "+x +",token_best_bid = " +y+" where id = "+ result2[0]['id'] +";";
               con.query(sql, function (err, result) {
                   if (err) throw err;
                   console.log(sql)
                   
                       
               });
               
           });
     
                   
       });
        
       
    });
}


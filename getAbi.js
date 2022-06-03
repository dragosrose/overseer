import fetch from 'node-fetch';


export async function getAbi(contract_address) {
    const url = 'https://api.etherscan.io/api?module=contract&action=getabi&address='+ contract_address + '&apikey=YourApiKeyToken';
    const response = await fetch(url);
    return await response.json();
}


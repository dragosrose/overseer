import {useRouter} from "next/router";
import {useState} from "react";
import {useEffect} from "react";
import NFTCard from "../../components/NFTCard";
import Link from "next/link";

export default function Collection() {
    const router = useRouter();
    const {collection} = router.query;

    const [isLoading, setLoading] = useState(false);
    const [nfts, setNFTs] = useState(null);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {Accept: 'application/json', 'X-API-KEY': '6cdbd6093ad24797ad20db0a879ba613'}
        };

        fetch('https://api.opensea.io/api/v1/assets?order_direction=desc&asset_contract_address=' + collection + '&limit=20&include_orders=false', options)
            .then(response => response.json())
            .then((nfts) => {
                setNFTs(nfts);
                // console.log(nfts);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1 className={'text-3xl'}>Contract Address: {collection}</h1>
            <div>
                {
                    isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className={'grid grid-cols-6 gap-6 p-6'}>
                            {nfts && nfts["assets"].map((nft, key) => {
                                    return <NFTCard metadata={nft} collection={collection}>

                                    </NFTCard>
                                }
                            )
                            }
                        </div>

                    )
                }
            </div>
        </div>
    );


}
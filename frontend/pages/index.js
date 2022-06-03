import {useAccount, useConnect, useDisconnect, useEnsName} from 'wagmi';
import {ethers} from "ethers";
import Web3Token from "web3-token";
import {useEffect, useState} from "react";
import {useLocalStorage} from "../components/useLocalStorage";
import NFTCard from "../components/NFTCard";
import {Button, Stack} from "@mui/material";
import CollectionCard from "../components/CollectionCard";

const Home = () => {
    const {data: account} = useAccount();
    const {data: ensName} = useEnsName({address: account?.address});
    const {connect, connectors, error, isConnecting, pendingConnector} =
        useConnect();
    const {disconnect} = useDisconnect();

    const [userToken, setToken] = useLocalStorage('token', '');

    // Somewhere here we set the time according to the token stored, rather
    // than just retrieving based on the last saved time values.

    const [minutes, setMinutes] = useLocalStorage('minutes', 0);
    const [seconds, setSeconds] = useLocalStorage('seconds', 0);

    const collections = [
      "azuki",
      "yureioffcial",
      "angry-ape-army"
    ];

    const [isLoading, setLoading] = useState(false);
    const [collectionsData, setCollectionsData] = useState([]);

    useEffect(() => {
        let arr = [];
        const options = {method: 'GET'};

        collections.forEach((col) => {
            fetch('https://api.opensea.io/api/v1/collection/' + col, options)
                .then(response => response.json())
                .then(response => arr.push(response))
                .catch(err => console.error(err));
        })

        setCollectionsData(arr);

    }, []);


    if (account) {
        // Web3 token doesn't work with any wallet besides Metamask :(
        // When we finish the app and have spare time we can think of something for the other wallets.
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const unlock = async () => {
            const token = await Web3Token.sign(async msg => await signer.signMessage(msg), {
                expires_in: '1 minute'
            });
            setToken(token);
            setMinutes(1);
            setSeconds(0);
            console.log(token);

        }

        const verify = async (token) => {
            const {address, body} = await Web3Token.verify(token);
            console.log('Address: ', address, body);
        }

        const pressButton = async () => {
            await verify(userToken);
            console.log('Token has not expired yet.');
        }

        const Timer = () => {
            useEffect(() => {
                let myInterval = setInterval(() => {
                    if (seconds > 0) {
                        setSeconds(seconds - 1);
                    }
                    if (seconds === 0) {
                        if (minutes === 0) {
                            clearInterval(myInterval)
                        } else {
                            setMinutes(minutes - 1);
                            setSeconds(59);
                        }
                    }
                }, 1000)
                return () => {
                    clearInterval(myInterval);
                };
            });

            return (
                <div>
                    {minutes === 0 && seconds === 0
                        ? null
                        : <h1> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
                    }
                </div>
            )
        };


        return (
            <div className={'py-6 text-center flex flex-col space-y-8'}>
                <div>
                    {ensName ? `${ensName} (${account.address})` : account.address}
                </div>
                <div>Connected to {account?.connector?.name}</div>
                <Stack direction={"row"} justifyContent={"center"} spacing={2}>
                    <Button variant={"outlined"}
                        onClick={() => disconnect()}
                    >
                        Disconnect
                    </Button>
                    <Button variant={"outlined"}
                        onClick={unlock}
                    >
                        {userToken && <Timer></Timer>}
                        {minutes === 0 && seconds === 0 && 'Unlock'}
                    </Button>
                    <Button variant={"outlined"}

                        onClick={pressButton}
                    >
                        Press Button
                    </Button>
                </Stack>

                <div className={'flex justify-center'}>
                    {
                        minutes === 0 && seconds === 0 ? (
                            <p>Unlock your wallet.</p>
                        ) : (
                            <div className={'grid grid-cols-3 gap-6 p-6'}>
                                {collectionsData.map((col, key) => {
                                        return <CollectionCard metadata={col["collection"]}>

                                        </CollectionCard>
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

    return (
        <div className={'py-24 text-center'}>
            <h1 className={'text-2xl font-bold'}>The 👁️verseer</h1>
            <p className={'mt-10'}>Connect your wallet:</p>
            <div className={'mt-5 flex justify-center gap-6'}>
                {connectors.map((connector) => {
                    return (
                        <button
                            className='rounded bg-slate-200 p-2 text-black'
                            key={connector.id}
                            onClick={() => connect(connector)}
                        >
                            {connector.name}
                            {!connector.ready && ' (unsupported)'}
                            {isConnecting &&
                                connector.id === pendingConnector?.id &&
                                ' (connecting)'}
                        </button>
                    );
                })}
            </div>

            {error && <div>{error.message}</div>}

        </div>
    );
};


export default Home;

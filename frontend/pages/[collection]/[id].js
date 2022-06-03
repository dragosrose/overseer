import {useRouter} from "next/router";
import ProfileCard from "../../components/ProfileCard";
import {useEffect, useState} from "react";

export default function Token({data}) {

    return (<div>
        <ProfileCard metadata={data}></ProfileCard>
    </div>);
};

export async function getServerSideProps(context) {

    const { collection, id } = context.query;

    const options = {
        method: 'GET',
        headers: {Accept: 'application/json', 'X-API-KEY': '6cdbd6093ad24797ad20db0a879ba613'}
    };

    const res = await fetch('https://api.opensea.io/api/v1/asset/' + collection + '/' +
        id + '/?include_orders=false', options).catch(err => console.error(err));
    const data = await res.json();


    return {
        props: {
            data,
        },
    }
}
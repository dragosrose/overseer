import Card from "@mui/material/Card";
import {CardActionArea} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import Link from "next/link";

export default function CollectionCard(props) {

    // console.log(props.metadata.collection.primary_asset_contracts);
    const [url, setUrl] = useState(props.metadata.collection.large_image_url);

    useEffect(() => {
        if(url === null)
            setUrl(props.metadata.collection.banner_image_url);
    }, [])

    return(<Card sx={{ maxWidth: 345 }}>
        <Link href={'/[collection]'} as={`/${props.metadata.collection.primary_asset_contracts[0].address}`} passHref>


        <CardActionArea>
            <CardMedia
                component="img"
                height="140"
                src={url}
                alt={"image"}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.metadata.collection.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {props.metadata.collection.short_description}
                </Typography>

            </CardContent>
        </CardActionArea>
        </Link>
    </Card>);
}
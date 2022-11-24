import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Link from "next/link";

export default function NFTCard(props) {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <Link href={'/[collection]/[id]'}
                  as={`/${props.collection}/${props.metadata.token_id}`} passHref>


            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={props.metadata.image_url}
                    alt={"image"}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.metadata.asset_contract.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.metadata.name}
                    </Typography>
                    <Typography variant={"body2"} color={"text.secondary"} align={"right"}>
                        [price] Ξ
                    </Typography>
                </CardContent>
            </CardActionArea>
            </Link>
        </Card>
    );
}

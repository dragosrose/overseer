import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {Button, CardActionArea, CardHeader, Dialog, DialogContent, Slide} from '@mui/material';
import {forwardRef, useEffect, useState} from "react";
import Image from "next/image";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProfileCard(props) {
    const [open, setOpen] = useState(false);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const imageLoader = ({src}) => {
        return props.metadata.image_url;
    }

    console.log(props);
    return ( <div>
            <Card sx={{ maxWidth: 500}}>
                <CardHeader
                    title={props.metadata.asset_contract.name}
                    subheader={'#' + props.metadata.token_id}
                />

                <Button onClick={handleClickOpen}>
                    <CardMedia
                        component="img"
                        height={140}
                        image={props.metadata.image_url}
                        alt={"image"}
                    />
                </Button>

                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted={true}
                    onClose={handleClose}

                >
                    <DialogContent style={{height: '80vh', width: '80vh'}}>
                        <Image loader={imageLoader}
                               src={props.metadata.image_url}
                               alt={'modal image'}
                               layout={'fill'}
                               quality={100}
                        >

                        </Image>
                    </DialogContent>

                </Dialog>

            </Card>

        </div>

    );
}

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Card, CardHeader, Collapse, IconButton, makeStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}));

export default function Vacation({ vacation, update, show }) {

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const classes = useStyles();

    const user = useSelector(state => state.user)

    const PriceStyle = {
        color: "DarkCyan",
        textDecoration: 'underline DarkGrey'
    }

    const [Follow, setFollow] = useState("")
    useEffect(() => {
        if (vacation.follower_id === user.userid) {
            setFollow("unFollow")
        } else {
            setFollow("Follow")
        }
    }, [])


    const FormatDates = (date1, date2) => {
        let firstDate = date1
        let secoundDate = date2
        let firstArray = firstDate.split("-")
        let secoundArray = secoundDate.split("-")
        let newFirstDate = firstArray[2] + "/" + firstArray[1] + "/" + firstArray[0]
        let newSecoundDate = secoundArray[2] + "/" + secoundArray[1] + "/" + secoundArray[0]
        return ("Check-In " + newFirstDate + " Check-Out " + newSecoundDate)
    }

    const handleUnFollow = async () => {
        try {
            let res = await fetch("/orders/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": localStorage.token },
                body: JSON.stringify({ userId: user.userid, vacationId: vacation.id, show })
            })
            let data = await res.json()
            update(data)
            setFollow("Follow")
            console.log(data)

        } catch (error) {
            console.log(error)
        }
    }


    const handleDelete = async () => {
        let res = await fetch("/vacations/" + vacation.id, {
            method: "DELETE",
            headers: { "Authorization": localStorage.token },
        })
        let data = await res.json()
        update(data)
        console.log(data)
    }



    const handleFollow = async () => {
        try {
            let res = await fetch("/orders/", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": localStorage.token },
                body: JSON.stringify({ userId: user.userid, vacationId: vacation.id, show })
            })
            let data = await res.json()
            update(data)
            setFollow("unFollow")
            console.log(data)
        } catch (error) {
            console.log(error)
        }

    }

    return (<>
        <Card className={classes.root}>
            <CardHeader
                title={vacation.dest}
                subheader={FormatDates(vacation.dept, vacation.arv)}
            />
            <CardMedia
                className={classes.media}
                image={vacation.picture}
                title={vacation.dest}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    Limited time for only <span style={PriceStyle}>${vacation.price}</span>
                </Typography>
            </CardContent>
            <CardActions disableSpacing>

                {user.login && user.role === "user" && Follow === "Follow" &&
                    (
                        <Button variant="contained" onClick={handleFollow} size="small" color="primary">
                            {Follow}
                        </Button>
                    )}
                {user.login && user.role === "user" && Follow === "unFollow" &&
                    (
                        <Button variant="outlined" color="secondary" onClick={handleUnFollow} size="small" >
                            {Follow}
                        </Button>
                    )}

                {user.login && user.role === "admin" &&
                    <>
                        <Button variant="contained" onClick={handleDelete} size="small" color="primary">
                            Delete
                        </Button>
                        <Link className="btn btn-warning btn-sm" to={"/edit/" + vacation.id} >Edit</Link>
                    </>
                }

                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>
                        {vacation.descrip}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    </>
    )
}



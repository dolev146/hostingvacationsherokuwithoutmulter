import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import FilterVacations from './FilterVacations'
import Vacation from './Vacation'
import Logout from './Logout'
import NoResultBar from './NoResultBar'
import Searchbar from './Searchbar'
import FlightIcon from '@material-ui/icons/Flight';


export default function Vacations({ history }) {

    const [vacations, setvacations] = useState([])
    const [show, setshow] = useState("All")

    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    useEffect(() => {
        (async () => {
            if (!user.login || user.role === "admin") {
                let res = await fetch("/vacations/")
                let data = await res.json()
                setvacations(data)
            } else if (user.role === "user") {
                let url = show === "All" ? "/vacations/regular/" : "/vacations/followed/"
                if (url === "/vacations/regular/") {
                    setshow("All")
                }
                let res = await fetch(url + user.userid, {
                    method: "GET",
                    headers: { "content-type": "application/json", "Authorization": localStorage.token }
                })
                let data = await res.json()
                if (data.error || !data.length) {
                    dispatch({ type: "visible" })
                    setTimeout(() => {
                        dispatch({ type: "hidden" })
                    }, 5000);
                    setshow("All")
                } else {
                    console.log(data)
                    setvacations(data)
                }

            }
        })()
    }, [show])



    return (
        <div className="container">
            <h1 className="header"><FlightIcon fontSize="large" /> vacations</h1>

            <div >
                {user.login ? (<div className="flex-login">
                    <h1>Hello {user.fname} </h1> <span className="logout-btn"><Logout /></span>
                </div>
                ) : (
                        <>
                            <div className="flex-buttons">
                                <Link className="btn btn-primary" to="/login">login</Link>
                                <Link className="btn btn-success" to="/signup" >signup</Link>
                            </div>
                        </>
                    )}
            </div>

            <Searchbar update={setvacations} />
            <NoResultBar />

            {user.login && user.role === "user" && <FilterVacations show={show} setshow={setshow} />}

            {user.login && user.role === "admin" &&
                <>
                    <Button variant="contained" color="primary" onClick={() => history.push("/add")}>Add vacation</Button>
                </>
            }
            {user.login && user.role === "admin" &&
                <>
                    <Button variant="contained" onClick={() => history.push("/reports")}>SHOW REPORTS</Button>
                </>
            }




            {
                <div className="vacations">
                    {vacations.map(f => (<Vacation show={show} update={setvacations} key={f.id} vacation={f} />))}
                </div>
            }


        </div>
    )
}

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'


export default function Searchbar({ update }) {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const [today, settoday] = useState()
    const [Checkin, setCheckin] = useState()
    const [CheckOut, setCheckOut] = useState()
    const [TexttoSearch, setTexttoSearch] = useState("")

    useEffect(() => {
        let date = new Date()
        let formated = date.toISOString().split("T")[0]
        settoday(formated)
        setCheckin(formated)
        setCheckOut(formated)
    }, [])

    const handleReset = async e => {
        try {
            (async () => {
                if (!user.login) {
                    let res = await fetch("/vacations/")
                    let data = await res.json()
                    update(data)
                } else {
                    let res = await fetch("/vacations/regular/" + user.userid, {
                        method: "GET",
                        headers: { "content-type": "application/json", "Authorization": localStorage.token }
                    })
                    let data = await res.json()
                    update(data)
                }
            })()
        } catch (error) {
            console.log(error)
        }
    }


    const handleSubmit = async e => {
        e.preventDefault()
        let adress = "/search?Checkin=" + Checkin + "&CheckOut=" + CheckOut + "&TexttoSearch=" + TexttoSearch
        try {
            let res = await fetch(adress)
            let data = await res.json()
            console.log(data)
            if (data.length > 0) {
                update(data)
            } else {
                dispatch({ type: "visible" })
                setTimeout(() => {
                    dispatch({ type: "hidden" })
                }, 2000);
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="form-group row">
                    <label htmlFor="Checkin" className="col-1 col-form-label">Check-In</label>
                    <div className="col-2">
                        <input onChange={e => setCheckin(e.target.value)}
                            className="form-control" type="date" defaultValue={today} id="Checkin" />
                    </div>
                    <label htmlFor="Checkout" className="col-1 col-form-label">CheckOut</label>
                    <div className="col-2">
                        <input onChange={e => setCheckOut(e.target.value)}
                            className="form-control" type="date" defaultValue={today} id="Checkout" />
                    </div>

                    <input onChange={e => setTexttoSearch(e.target.value)}
                        type="text" className="col-4 ml-4 col-form-label form-control" placeholder="some info about the vacation" aria-label="some info about the vacation" aria-describedby="button-addon" />
                    <button className="btn btn-info">Search</button>
                    <input onClick={e => handleReset(e)}
                        className="btn btn-secondary" type="reset" defaultValue="Reset" />
                </div>
            </form>

        </>
    )
}

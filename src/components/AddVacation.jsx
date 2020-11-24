import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function AddVacation({ history }) {

    const user = useSelector(state => state.user)

    useEffect(() => {
        if (!user.login || user.role !== "admin") {
            history.push("/")
        }
    }, [])


    const [descrip, setdescrip] = useState("")
    const [dest, setdest] = useState("")
    const [picture, setpicture] = useState("")
    const [dept, setdept] = useState("")
    const [arv, setarv] = useState("")
    const [price, setprice] = useState("")

    const handleSubmit = async e => {
        e.preventDefault()
        if (descrip === "" || dest === "" || picture === "" || dept === "" || arv === "" || price === "") {
            alert("hey sir you need to fill all the feilds before adding a vacation!")
        } else {
            try {
                let res = await fetch("/vacations/add", {
                    method: "POST",
                    headers: { "content-type": "application/json", "Authorization": localStorage.token },
                    body: JSON.stringify({ descrip, dest, picture, dept, arv, price })
                })
                let data = await res.json()
                console.log(data)
                history.push("/")
            } catch (err) {
                console.log(err)
            }
        }
    }


    return (
        <div className="container">
            <h1 className="header">Add vacation</h1>
            <Link className="btn btn-primary mb-2" to="/">back</Link>
            <form onSubmit={handleSubmit} >
                <div className="input-group container">
                    <input className="form-control" required autoComplete onChange={e => setdest(e.target.value)} type="text" placeholder="destination" />
                    <input className="form-control" required autoComplete onChange={e => setdescrip(e.target.value)} type="text" placeholder="description" />
                    <input className="form-control" required autoComplete onChange={e => setpicture(e.target.value)} type="text" placeholder="picture URL" />
                    <input className="form-control" required autoComplete onChange={e => setdept(e.target.value)} type="date" placeholder="departure" />
                    <input className="form-control" required autoComplete onChange={e => setarv(e.target.value)} type="date" placeholder="Return" />
                    <input className="form-control" required autoComplete onChange={e => setprice(e.target.value)} type="number" placeholder="price" />
                    <button className="btn btn-primary" >Add vacation</button>
                </div>
            </form>
        </div>
    )
}

import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Signup({ history }) {

    const [fname, setfname] = useState("")
    const [lname, setlname] = useState("")
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [error, seterror] = useState("")

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            let res = await fetch("/users/register", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ username, password, fname, lname })
            })
            let data = await res.json()
            console.log(data)
            if (data.error) {
                seterror(data.msg)
            } else {
                history.push("/login")
            }
        } catch (err) {

        }
    }

    return (
        <div className="container">
            <h1 className="header">signup</h1>

            <p className="mb-3 mt-3 ml-3">already have an account?  <Link className="btn btn-primary btn-sm" to="/login" >Login</Link> </p>

            <form onSubmit={handleSubmit}>
                <span className="alert-danger">{error}</span>

                <div className="input-group container">
                    <input onChange={e => setfname(e.target.value)}
                        type="text" aria-label="fname" placeholder="fname" className="form-control" />
                    <input onChange={e => setlname(e.target.value)}
                        type="text" aria-label="lname" placeholder="lname" className="form-control" />
                    <input onChange={e => setusername(e.target.value)}
                        type="text" aria-label="username" placeholder="username" className="form-control" />
                    <input onChange={e => setpassword(e.target.value)}
                        type="password" aria-label="password" placeholder="password" className="form-control" />
                    <button className="btn btn-success">sign up</button>
                </div>
            </form>

        </div>
    )
}

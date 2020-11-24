import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import decode from 'jwt-decode'


export default function Login({ history }) {

    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [error, seterror] = useState("")


    const dispatch = useDispatch()


    const handleSubmit = async e => {
        e.preventDefault()
        try {
            let res = await fetch("/users/login", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ username, password })
            })
            let data = await res.json()
            console.log(data)
            if (data.error) {
                seterror(data.msg)
            } else {
                localStorage.token = data.access_token
                let { id, role, fname } = decode(data.access_token)
                dispatch({ type: "LOGIN", payload: { id, role, fname } })
                history.push("/")
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="container">
            <h1 className="header">Login</h1>

            <p className="mb-3 mt-3 ml-3" >dont have an account yet? <Link className="btn btn-success btn-sm" to="/signup" >signup</Link> </p>


            <form onSubmit={handleSubmit}>
                <span className="alert-danger">{error}</span>
                <div className="input-group container">
                    <input onChange={e => setusername(e.target.value)}
                        type="text" aria-label="username" placeholder="username" className="form-control" />
                    <input onChange={e => setpassword(e.target.value)}
                        type="password" aria-label="password" placeholder="password" className="form-control" />
                    <button className="btn btn-primary">login</button>
                </div>
            </form>
        </div>
    )
}

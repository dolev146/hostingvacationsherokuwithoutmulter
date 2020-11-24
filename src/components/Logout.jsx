import { Button } from '@material-ui/core'
import React from 'react'
import { useDispatch } from 'react-redux'
export default function Logout() {
    const dispatch = useDispatch()
    const Logout = () => {
        dispatch({ type: "LOGOUT" })
    }

    return ( 
        <div>
            <Button onClick={() => Logout()} 
             variant="outlined" 
             color="secondary">
                Logout
              </Button>
        </div>
    )
}

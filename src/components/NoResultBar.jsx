import React from 'react'
import { useSelector } from 'react-redux'

export default function NoResultBar() {
    const Warning = useSelector(state => state.Warning)
    return (
        <>
            {Warning.visible === "visible" && < div className="alert alert-danger" role="alert" >
                No matching search results 
            </div >}
        </>
    )
}

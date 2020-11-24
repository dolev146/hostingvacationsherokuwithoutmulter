let initialUser = {
    login: false
}


export const user = (state = initialUser, action) => {
    switch (action.type) {
        case "LOGIN":
            let newState = {
                login: true,
                userid: action.payload.id,
                fname: action.payload.fname,
                role: action.payload.role
            }
            return newState
        case "LOGOUT":
            return initialUser
        default:
            return state
    }
}


let initialWarning = {
    visible: "hidden"
}


export const Warning = (state = initialWarning, action) => {
    switch (action.type) {
        case "visible":
            let newState = {
                visible : "visible"
            }
            return newState
        case "hidden":
            return initialWarning
        default:
            return state
    }
}




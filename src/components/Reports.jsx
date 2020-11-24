import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import { Link } from "react-router-dom";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory";
let array2;


export default function Reports({ history }) {
    const user = useSelector(state => state.user)
    const [data, setdata] = useState([])
    const [numberOfobjects, setnumberOfobjects] = useState([])
    const [nameOfeveryBar, setnameOfeveryBar] = useState([])


    useEffect(() => {

        if (!user.login || user.role !== "admin") {
            history.push("/")
        } else {
            (async () => {
                try {
                    let res = await fetch("/orders/reports", {
                        method: "POST",
                        headers: { "content-type": "application/json", "Authorization": localStorage.token }
                    })
                    let chartInfo = await res.json()
                    console.log(chartInfo)
                    setdata(chartInfo)
                    let array1 = chartInfo.map((m, i) => i + 1)
                    setnumberOfobjects(array1)
                    array2 = chartInfo.map((f) => f.dest)
                    setnameOfeveryBar(array2)

                } catch (error) {
                    console.log(error)
                }
            })()
        }
    }, [])

    return (
        <>
            <h1 className="reports_header">reports</h1> <div className="biggerText"><Link to="/">Go back</Link></div>
            <div className="graph">
                <VictoryChart
                    // domainPadding will add space to each side of VictoryBar to
                    // prevent it from overlapping the axis
                    style={{
                        parent: {
                            border: "1px solid #ccc"
                        },
                        background: {
                            fill: "#cee4ff"
                        }
                    }}
                    theme={VictoryTheme.material}
                    domainPadding={20}
                >
                    <VictoryAxis
                        // tickValues specifies both the number of ticks and where
                        // they are placed on the axis
                        tickValues={numberOfobjects}
                        tickFormat={array2}
                    />
                    <VictoryAxis
                        dependentAxis
                        // tickFormat specifies how ticks should be displayed
                        tickFormat={(x) => (`${x}`)}
                    />
                    <VictoryBar
                        data={data}
                        x="dest"
                        y="followers"
                    />
                </VictoryChart>
            </div>
        </>
    )
}








// let numberOfobjects;
// let nameOfeveryBar;
// let chartInfo;
// (async () => {
//     try {
//         let res = await fetch("/orders/reports", {
//             method: "POST",
//             headers: { "content-type": "application/json", "Authorization": localStorage.token }
//         })
//         chartInfo = await res.json()
//         numberOfobjects = chartInfo.map((m, i) => i + 1)
//         nameOfeveryBar = chartInfo.map((f) => f.dest)
//     } catch (error) {
//         console.log(error)
//     }
// })()

// export default function Reports({ history }) {

//     const user = useSelector(state => state.user)

//     useEffect(() => {
//         if (!user.login || user.role !== "admin") {
//             history.push("/")
//         }
//     }, [])

//     return (
//         <>
//             <h1 className="reports_header">reports</h1> <div className="biggerText"><Link to="/">Go back</Link></div>
//             <div className="graph">
//                 <VictoryChart
//                     style={{
//                         parent: {
//                             border: "1px solid #ccc"
//                         },
//                         background: {
//                             fill: "#cee4ff"
//                         }
//                     }}
//                     theme={VictoryTheme.material}
//                     domainPadding={30}>
//                     <VictoryAxis
//                         tickValues={numberOfobjects}
//                         tickFormat={nameOfeveryBar}
//                     />
//                     <VictoryAxis
//                         dependentAxis
//                         tickFormat={(x) => (`${x} followers`)}
//                     />
//                     <VictoryBar
//                         data={chartInfo}
//                         x="dest"
//                         y="followers"
//                     />
//                 </VictoryChart>
//             </div>
//         </>
//     )
// }



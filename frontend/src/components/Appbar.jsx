import { useState } from "react"

export const Appbar = () => {
    const [username,setUsername] = useState(localStorage.getItem("username"))
    console.log(username)
    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center font-bold h-full ml-4">
            PAYTM App
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                Hello {username}
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {username[0].toUpperCase()}
                </div>
            </div>
        </div>
    </div>
}
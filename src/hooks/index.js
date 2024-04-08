import {useEffect, useState} from "react";


export const useCountDown = (seconds = 8) => {
    seconds = Math.round(Math.abs(seconds)) || 8

    const [count, setCount] = useState(seconds)
    const [endStatus, setEndStatus] = useState(false)

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (count > 1) {
                setCount((prev) => prev - 1)
            } else {
                setEndStatus(true)
            }
        }, 1000)

        return () => clearTimeout(timerId)
    }, [count])

    return [count, endStatus]
}

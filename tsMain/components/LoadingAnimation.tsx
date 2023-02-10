import React, {useEffect, useState} from "react";

export function LoadingAnimation() {
    const [animationCount, setAnimationCount] = useState(0)

    const buffer = 0

    const duration = 1000
    const delayPerChars = 180

    const Char = (props: { delay?: string, children: string }) => {
        const style = {
            animationDelay: props.delay,
            animationDuration: `${duration}ms`
        }

        return <div className={"animate__animated animate__bounce"}
                    style={style}>
            {props.children}
        </div>
    }

    const calcDelay = (index: number) => `${index * delayPerChars}ms`

    useEffect(() => {
        setTimeout(() => setAnimationCount(animationCount + 1), delayPerChars * 6 + duration + buffer)
    })

    return (<div>
        <div className={"d-flex justify-content-center my-4 text-secondary"}>
            <Char>L</Char>
            <Char delay={calcDelay(1)}>O</Char>
            <Char delay={calcDelay(2)}>A</Char>
            <Char delay={calcDelay(3)}>D</Char>
            <Char delay={calcDelay(4)}>I</Char>
            <Char delay={calcDelay(5)}>N</Char>
            <Char delay={calcDelay(6)}>G</Char>
        </div>
    </div>)
}
import React, {CSSProperties, useState} from "react";
import {vibrateOnce} from "../util/vibration";

export type LikeButtonProps = {
    like: boolean
    count: number,
    onClick: () => void
}

export function LikeButton(props: LikeButtonProps) {
    const {like, count, onClick} = props
    const [hover, setHover] = useState(false)

    return <div className={'p-2'}
                onClick={onClick}
                onMouseEnter={() => setHover(true)}
                onMouseOut={() => setHover(false)}
    >
        {count ? <div className={'ms-1'}>{count}</div> : null}
        <div className={'btn-like'}>
            <i className="fa-solid fa-heart"></i>
        </div>
    </div>
}
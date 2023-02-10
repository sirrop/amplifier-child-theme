import React from "react";

type ImageIconProps = {
    src: string,
    size?: number,
    alt?: string,
    id?: string,
    className?: string,
    circle?: boolean
}

export function ImageIcon(props: ImageIconProps): JSX.Element {
    let {
        src,
        size = 24,
        alt = 'Icon',
        id,
        className,
        circle = false
    } = props

    if (circle) {
        if (className) {
            className += ' rounded-circle'
        } else {
            className = 'rounded-circle'
        }
    }

    return (<img src={src}
                 alt={alt}
                 id={id}
                 width={size}
                 height={size}
                 className={className} />)
}
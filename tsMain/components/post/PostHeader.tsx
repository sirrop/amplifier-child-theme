import {PostState} from "./PostState";
import React, {useState} from "react";
import {ImageIcon} from "../ImageIcon";
import {Link} from "react-router-dom";

export function PostHeader(props: PostState) {
    const [hover ,setHover] = useState(false)
    const post = props.post
    const author = post.author

    const textDecoration = hover ? 'text-decoration-underline' : 'text-decoration-none'
    const iconSize = 24

    return (<div className={"mb-1"}>
        <Link className={"pe-auto d-flex link-dark " + textDecoration}
              onMouseEnter={() => setHover(true)}
              onMouseOut={() => setHover(false)}
              to={'/community/user/' + post.author.slug}>
            <ImageIcon src={author.icon}
                       alt={"icon"}
                       circle={true}
                       className={"me-1"}
                       size={iconSize} />
            <div style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden"
            }}>
                <span onMouseEnter={() => setHover(true)}>{author.name}</span>
                <small className={"link-secondary"} onMouseEnter={() => setHover(true)}>@{author.slug}</small>
            </div>
        </Link>
    </div>)
}
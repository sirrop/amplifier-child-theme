import React, {useState} from "react";
import {PostState} from "./PostState";
import {PostHeader} from "./PostHeader";
import {PostBody} from "./PostBody";
import {PostFooter} from "./PostFooter";
import {PostModel} from "../../models/post/PostModel";

export function Post(props: PostState) {
    const [deleted, setDeleted] = useState(false)
    const [post, setPost] = useState(props.post)

    const onUpdate = (post: PostModel) => {
        setPost(post)
    }

    if (deleted) {
        return <></>
    }

    return (<div id={`post-${post.id}`} className={"post-card rounded m-2 p-2 shadow-sm"}>
        <PostHeader post={post} readingUser={props.readingUser} />
        <PostBody post={post} readingUser={props.readingUser} onUpdate={onUpdate} />
        <hr />
        <PostFooter post={post} onUpdate={onUpdate} onDelete={() => setDeleted(true)} readingUser={props.readingUser} />
    </div>)
}
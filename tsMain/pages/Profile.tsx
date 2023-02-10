import React from "react";
import {useParams} from "react-router";
import {User} from "../models/users/User";
import {Header} from "./profile/Header";
import {Body} from "./profile/Body";
import {Layout} from "../components/Layout";
import {useUsers} from "../util/Hooks";
import {LoadingAnimation} from "../components/LoadingAnimation";

export function Profile(props: {
    user: User
}) {
    const user = props.user
    const { slug } = useParams()

    if (user.slug === slug) {
        return (<Layout user={user}>
            <div>
                <Header user={user} reader={user} />
                <Body user={user} reader={user}/>
            </div>
        </Layout>)
    }

    const [{users, isLoading, isSuccess}] = useUsers({
        slug: [slug]
    })

    if (isLoading) {
        return <Layout user={user}>
            <div>
                <LoadingAnimation />
            </div>
        </Layout>
    }

    if (isSuccess && users[0]) {
        return <Layout user={user}>
            <div>
                <Header reader={user} user={users[0]} />
                <Body reader={user} user={users[0]} />
            </div>
        </Layout>
    }

    if (!users[0]) {
        return <Layout user={user}>
            <div>
                <h2>NOT FOUND</h2>
                該当のユーザーは見つかりませんでした
            </div>
        </Layout>
    }

    return <Layout user={user}>
        <div>
            ロード中にエラーが発生しました
        </div>
    </Layout>
}
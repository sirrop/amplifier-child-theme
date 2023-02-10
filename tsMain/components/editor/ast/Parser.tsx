import React, {useState} from "react";
import {Token, TokenType} from "./Token";
import {Link} from "react-router-dom";
import {RoutePaths} from "../../../models/RoutePaths";
import {lexer} from "./Lexer";
import {UUID} from "../../../util/UUID";

export function parse(text: string): JSX.Element[] {
    return lexer(text).map((token: Token) => {
        switch (token.type) {
            case TokenType.TEXT:
                return <span key={UUID.generateShort()}>{token.image}</span>
            case TokenType.HASH:
                return <HashTag hashTag={token.image} key={UUID.generateShort()} />
            case TokenType.AT:
                return <UserRef image={token.image} key={UUID.generateShort()} />
            case TokenType.NEXT_LINE:
                return <br key={UUID.generateShort()} />
        }
    })
}

function reload() {
    window.location.reload()
}

function HashTag(props: {hashTag: string}) {
    const {hashTag} = props
    const [hover, setHover] = useState(false)
    const tag = hashTag.substring(1)
    return <object>
        <Link to={RoutePaths.EXPLORE + `?acs=${encodeURI(tag)}`}
              onMouseEnter={() => setHover(true)}
              onMouseOut={() => setHover(false)}
              className={hover ? "" : "text-decoration-none"}>{hashTag}</Link>
    </object>
}

function UserRef(props: {
    image: string
}) {
    const {image} = props
    const [hover, setHover] = useState(false)
    return <object>
        <Link to={'/community/user/' + encodeURI(image.substring(1))}
              onMouseEnter={() => setHover(true)}
              onMouseOut={() => setHover(false)}
              className={"text-secondary text-decoration-none" + (hover ? " bg-light" : "")}>
            {image}
        </Link>
    </object>
}
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {RoutePaths} from "./models/RoutePaths";
import {Top} from "./pages/Top";
import {Explore} from "./pages/Explore";
import {Signup} from "./pages/Signup";
import {Login} from "./pages/Login";
import {Logout} from "./pages/Logout";
import {Debug} from "./pages/Debug";
import {Profile as MyPage} from "./pages/Profile";
import {AccessInhibited} from "./pages/AccessInhibited";
import {PostPage} from "./pages/PostPage";
import {useCurrentUser} from "./util/Hooks";
import {settings} from "./settings";


export function App() {
    const [user, login, logout] = useCurrentUser()

    return (<>
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path={RoutePaths.TOP} element={<Top user={user} />} />
                    <Route path={RoutePaths.EXPLORE} element={<Explore user={user} />} />
                    <Route path={RoutePaths.PROFILE} element={<MyPage user={user} />} />

                    <Route path={RoutePaths.SIGNUP} element={<Signup />} />
                    <Route path={RoutePaths.LOGIN} element={<Login login={login} />} />
                    <Route path={RoutePaths.LOGOUT} element={<Logout to={RoutePaths.TOP} logout={logout} />} />

                    <Route path={RoutePaths.POST} element={<PostPage user={user} />} />

                    {settings.debug ? <Route path={RoutePaths.DEBUG} element={<Debug />} /> : null}
                    <Route path={RoutePaths.ACCESS_INHIBITED} element={<AccessInhibited />} />
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    </>)
}
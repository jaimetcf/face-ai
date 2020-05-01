import { createContext } from 'react';


export const AppContext = createContext({
    userLoggedIn: false,
    userId: null,
    token: null,
    loginFun: () => {},
    logoutFun: () => {}
});

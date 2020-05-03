import { createContext } from 'react';


export const AppContext = createContext({
    backendDomain: '',    
    userIn: false,         // True, if user logged in. False otherwise
    userId: '',
    token: '',
    loginFun: () => {},
    logoutFun: () => {}
});

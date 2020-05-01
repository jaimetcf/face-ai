import React, { useContext }  from 'react';
import { AppContext }         from '../../AppContext';


const Logout = () => {
    
    const appContext = useContext(AppContext);
    appContext.logoutFun();

    return(<div></div>);
}


export default  Logout;
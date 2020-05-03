import { useState, useCallback, useRef, useEffect } from 'react';


// This functional component, created to be reusable, manages the following logic:
// 1- The waiting state logic so React renders or not a waiting screen
// 2- fetch request logic
// 3- The error state logic so React renders or not an error message to the user
// 4- Abort http request logic
export const useHttp = () => {
  
  // This state goes true whenever a request was sent to the 
  // backend and the response was not received yet
  const [ waiting, setWaiting ] = useState(false);

  // This state saves any error ocurred when communicating with the backend
  const [ error, setError ] = useState();

  const activeHttpRequests = useRef([]);

  const httpRequest = useCallback(
    async (url, method = 'GET', headers = {}, body = null ) => { 
      setWaiting(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
      
        const res = await fetch(url, {
          method: method,
          headers: headers,
          body: body
//          signal: httpAbortCtrl.signal
        });

        const response = await res.json();

        // Removes the abort controller that triggered this call, 
        // if any, from the list of active abort controlers
        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );

        if(res.ok) {  // Status = 2xx
          setWaiting(false);
          return(response);
        }
        else {             // Status IS NOT 2xx
          // Forwards error message comming from backend
          // to be treated below in the catch block
          throw new Error(response.message);
        }

      } catch (err) {

        setWaiting(false);
        setError(err.message);
        throw err;   // Caller is informed an error ocurred
                     // because this function returns undefined,
                     // if an error ocurred
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  // Flushes the list of abort controllers
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { waiting, error, httpRequest, clearError };
};

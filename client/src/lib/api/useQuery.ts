import { useState, useEffect, useCallback } from "react";
import { server } from './server';

// TData or null since data shape forms only after API call completes
interface State<TData> {
    data: TData | null;
    loading: boolean;
    error: boolean;
}

export const useQuery = <TData = any>(query: string) => {
    // (a)
    const [state, setState] = useState<State<TData>>({
        data: null,
        loading: false,
        error: false
    });

    // (d)
    const fetch = useCallback(() => {
        const fetchApi = async () => {
            try {
                setState({ 
                data: null, 
                loading: true,
                error: false 
                });
                // destructure data, errors
                const { data, errors } = await server.fetch<TData>({ 
                    query 
                });

                if (errors && errors.length) {
                    throw new Error(errors[0].message);
                }
                setState({ 
                    data, 
                    loading: false, 
                    error: false 
                });
            } 
            catch (err) {
                setState({
                    data: null,
                    loading: false,
                    error: true
                });
                // will prevent further execution of code via throw
                throw console.error(err);
            }
        };

        fetchApi();
    }, [query]);

    // (b)
    useEffect(() => {
        fetch();
    }, [fetch]);
    
    // (c)
    return { ...state, refetch: fetch };
};


/*
(a)
    pass State interface as expected type var of useState hook
*/

/*
(b)
    https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies
    constructing server.fetch() function
        fetchApi() function responsible for making API request
            runs the server.fetch() function
            as this executes, pass in query payload and
            a type var of the data to be returned
    Goal: run fetchApi() func only when a component first mounts
        Solution: run func in the effect cb and specify an empty []
            in the effect's dependencies list
    Goal: avoid referencing a stale value as query is passed from elsewhere
        Solution: include query in dependency array
    https://github.com/facebook/react/issues/14920#issuecomment-471070149
*/

/*
(c)
    to set up refetch, must have fetchApi func declared outside of useEffect hook
    then, in return statement of useQuery, return ...state, refetch: fetchApi
        why?
        using JS spread syntax to expand properties of state in new object
            moreover, refetch now has the value of the fetchApi() func
*/

/*
(c)
    useCallback returns a memoized version of the cb being passed in
        memoization is a technique geared towards improving performance by storing
        results of function calls and returning hte cached result when the same inquiry
        for the function is made once more
    useEffect function when server mounts for first time
        replace query with fetch in useEffect dependency array
    refetch defined in return is now the memoized value (fetch) calling the useCallback hook
        query is contained within useCallback dependency array
*/
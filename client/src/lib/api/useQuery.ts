import { useState, useEffect } from "react";
import { server } from './server';

// TData or null since data shape forms only after API call completes
interface State<TData> {
    data: TData | null;
}

export const useQuery = <TData = any>(query: string) => {
    // (a)
    const [state, setState] = useState<State<TData>>({
        data: null
    });

    // (b)
    useEffect(() => {
        const fetchApi = async () => {
            const { data } = await server.fetch<TData>({ query });
            setState({ data });
        };

        fetchApi();
    }, [query]);

    return state
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
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
    
};


/*
(a)
    pass State interface as expected type var of useState hook
*/

/*
(b)
    https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies
    constructing server.fetch() function
*/
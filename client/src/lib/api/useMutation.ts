import { useReducer } from "react";
import { server } from "./server";

// state interface descriptive of state obj shape to maintain
interface State<TData> {
	data: TData | null;
	loading: boolean;
	error: boolean;
}

// (d)
type MutationTuple<TData, TVariables> = [
    (variables?: TVariables | undefined) => Promise<void>,
    State<TData>
];

type Action<TData> = 
    | { type: "FETCH" }
    | { type: "FETCH_SUCCESS"; payload: TData }
    | { type: "FETCH_ERROR" };


const reducer = <TData>() => (
    state: State<TData>,
    action: Action<TData>
) => {
    switch (action.type) {
        case "FETCH":
            return { 
                ...state,
                loading: true 
            };
        case "FETCH_SUCCESS":
            return {
                ...state,
                data: action.payload,
                loading: false,
                error: false
            };
        case "FETCH_ERROR":
            return {
                ...state,
                loading: false,
                error: true
            };
        default:
            throw new Error();
    }
};

// (a)
export const useMutation = <TData, TVariables = {}>(
    query: string
): MutationTuple<TData, TVariables> => {
    const fetchReducer = reducer<TData>();
	const [state, dispatch] = useReducer(fetchReducer, {
		data: null,
		loading: false,
		error: false
	});
	const fetch = async (variables?: TVariables) => {
		try {
            dispatch({ type: "FETCH" });
			const { data, errors } = await server.fetch<TData, TVariables>({
				query,
				variables,
            });
            // (b)
            if (errors && errors.length) {
                throw new Error(errors[0].message);
            }

            dispatch({ type: "FETCH_SUCCESS", payload: data });
		} catch (err) {
            dispatch({ type: "FETCH_ERROR" });
            throw console.error(err);
        }
    };
    // (c)
    return [fetch, state]
};

/*
(a)
    TData -> shape of data returned from mutation
    TVariables -> shape of vars the mutation is to accept
    Pseudo-example of what this hook is to do
        const [request, []] = useMutation<Data, Variables>(MUTATION);
        request({ id: '' })
    variables? optional in fetch async call
        Why?
            may be mutations that don't require any variables
    Why no useEffect Hook?
        Want the component(s) importing useMutation to make that call
            that is, when a request should be made
*/

/*
(b)
    could also be refactored as follows
    			errors && errors.length
				? new Error(errors[0].message) && console.log(errors)
				: null;
*/


/*
(c)
    return an array instead of an object list
        Why?
            When destructuring the array values fetch and state in components
            can name the request function for each use-case
        How?
            Because arrays aren't mapped on key-value pairs, but instead indices
*/

/*
(d)
    Tuple types - designating unique types to returned array of useMutation
        express an array with a fixed number of elements whose types are known
    MutationTuple type alias -> array of two values:
        (1) the type of a function that accepts variables? (optional) arg and
            returns a promise that when resolved is void
        (2) the type of the State interface
    Return type of the useMutation hook is MutationTuple with aforementioned type vars
*/
import { useState } from "react";
import { server } from "./server";

// state interface descriptive of state obj shape to maintain
interface State<TData> {
	data: TData | null;
	loading: boolean;
	error: boolean;
}

// (a)
export const useMutation = <TData = any, TVariables = any>(query: string) => {
	const [state, setState] = useState<State<TData>>({
		data: null,
		loading: false,
		error: false
	});
	const fetch = async (variables?: TVariables) => {
		try {
			setState({
				data: null,
				loading: true,
				error: false
			});

			const { data, errors } = await server.fetch<TData, TVariables>({
				query,
				variables,
            });
            // (b)
            if (errors && errors.length) {
                throw new Error(errors[0].message);
            }
            setState({
                data,
                loading: false,
                error: false
            });
		} catch (err) {
            setState({
                data: null,
                loading: false,
                error: true
            });
            throw console.error(err);
        }
	};
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
*/

/*
(b)
    could also be refactored as follows
    			errors && errors.length
				? new Error(errors[0].message) && console.log(errors)
				: null;
*/

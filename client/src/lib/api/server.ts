interface Body<TVariables> {
    query: string;
    variables?: TVariables;
}
// variables? -> type can be defined or undefined

interface Error {
    message: string;
}

export const server = {
    fetch: async <TData = any, TVariables = any>(
        body: Body<TVariables>
    ) => {
        const res = await fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        // if network status !200-299 then throw a new error
        // res.ok used to check if server returns status !successful
        if (!res.ok) {
            throw new Error("failed to fetch from server");
        }

        // returned errors field within res is if the res.ok is successful
        // but the graphql api returns an error within an errors field
        return res.json() as Promise<{ 
            data: TData;
            errors: Error[]; 
        }>;
    }
};

// two ways of type asserting:
    // return <Promise<{ data: TData }>>res.json();
    // return res.json() as Promise<{ data: TData }>;
// only in cases we know better than the compiler do we assert
/*
Type assertions should be used sparingly because it's easy to type assert 
information without specifying the properties that are needed in the type. 
Most of the time we'll assign types normally but only in cases we know 
better than the compiler - do we assert.
*/
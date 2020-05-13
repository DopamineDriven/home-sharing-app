interface Body<TVariables> {
    query: string;
    variables?: TVariables;
}
// variables? -> type can be defined or undefined

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
        // type assert the returned value
        return res.json() as Promise<{ data: TData }>;
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
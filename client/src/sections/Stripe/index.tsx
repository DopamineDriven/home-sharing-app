import React, { useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Layout, Spin } from "antd";
import { CONNECT_STRIPE } from "../../lib/graphql/mutations";
import {
    ConnectStripe as ConnectStripeData,
    ConnectStripeVariables
} from "../../lib/graphql/mutations/ConnectStripe/__generated__/ConnectStripe";
import { Viewer } from "../../lib/types";


const { Content } = Layout;

interface Props {
    viewer: Viewer;
}

export const Stripe = ({ viewer }: Props) => {
    const [connectStripe, { data, loading, error }] = useMutation<
        ConnectStripeData,
        ConnectStripeVariables
    >(CONNECT_STRIPE);

    // useRef.current is mutable and does not trigger rerender on change
    const connectStripeRef = useRef(connectStripe);

    // (a)
    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");

        if (code) {
            connectStripeRef.current({
                variables: {
                    input: { code }
                }
            });
        }
    }, []);
    
    // (b)
    if (error) {
        return <Redirect to={`/user/${viewer.id}?stripe_error=true`} />;
    }

    return loading ? (
        <Content className="stripe">
            <Spin size="large" tip="Connecting with Stripe account..." />
        </Content>
	) : (
        <h2>Stripe</h2>
    );
};

/*
(a)
run the connectStripe mutation in useEffect (lifecycle) and pass in the
code retrieved vrom the query parameter (in the URL)
    Use the URL constructor -- const url = new URL(url [, base]) --
    and retrieve the value of the param labeled code
With the code query param available, run the connectStripe mutation func
and provide the input obj variable that is to contain the code property

*/

/*
(b)
    error -> /user/viewer.id === /user/:id
    redirects user to their own page on error
        incorporate query param to indicate an error
            {`...?stripe_error=true`}
*/
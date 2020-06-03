import React, { useEffect, useRef } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { useScrollToTop } from "../../lib/hooks";
import { Layout, Spin } from "antd";
import { CONNECT_STRIPE } from "../../lib/graphql/mutations";
import {
    ConnectStripe as ConnectStripeData,
    ConnectStripeVariables
} from "../../lib/graphql/mutations/ConnectStripe/__generated__/ConnectStripe";
import { Viewer } from "../../lib/types";
import { displaySuccessNotification } from "../../lib/utils";


const { Content } = Layout;

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

export const Stripe = ({ viewer, setViewer, history }: Props & RouteComponentProps) => {
    useScrollToTop();

    const [connectStripe, { data, loading, error }] = useMutation<
        ConnectStripeData,
        ConnectStripeVariables
    >(CONNECT_STRIPE, {
        onCompleted: data => {
            if (data && data.connectStripe) {
                setViewer({ 
                    ...viewer, 
                    hasWallet: data.connectStripe.hasWallet 
                });
                displaySuccessNotification(
                    "Successfully connected to Stripe!",
                    "Head to the Host page to create new listings."
                );
            }
        }
    });
    // useRef.current -> mutable
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
        } else {
            history.replace("/login")
        }
    }, [history]);

    return error ? (
        <Redirect to={`/user/${viewer.id}?stripe_error=true`} />
    ) : data && data.connectStripe ? (
        <Redirect to={`/user/${viewer.id}`} />
    ) : loading ? (
        <Content className="stripe">
            <Spin size="large" tip="Connecting with Stripe account..." />
        </Content>
    ) : null;
};

/*
    return error ? (
        <Redirect to={`/user/${viewer.id}?stripe_error=true`} />
    ) : data && data.connectStripe ? (
        <Redirect to={`/user/${viewer.id}`} />
    ) : loading ? (
        <Content className="stripe">
            <Spin size="large" tip="Connecting with Stripe account..." />
        </Content>
    ) : null;
    
        if (data && data.connectStripe) {
        return <Redirect to={`/user/${viewer.id}`} />;
    }
    
    // (b)
    if (error) {
        return <Redirect to={`/user/${viewer.id}?stripe_error=true`} />;
    }

    if (loading) {
        return (
        <Content className="stripe">
            <Spin size="large" tip="Connecting with Stripe account..." />
        </Content>
        );
    }

    return null;


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
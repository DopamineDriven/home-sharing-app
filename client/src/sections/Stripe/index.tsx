import React, { useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Layout, Spin } from "antd";
import { CONNECT_STRIPE } from "../../lib/graphql/mutations";
import {
    ConnectStripe as ConnectStripeData,
    ConnectStripeVariables
} from "../../lib/graphql/mutations/ConnectStripe/__generated__/ConnectStripe";

const { Content } = Layout;

export const Stripe = () => {
    const [connectStripe, { data, loading, error }] = useMutation<
        ConnectStripeData,
        ConnectStripeVariables
    >(CONNECT_STRIPE);

    useEffect(() => {
        
    }, []);


    return (
        <h2>Stripe</h2>
    );
};
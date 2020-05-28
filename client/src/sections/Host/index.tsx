import React from 'react';
import { Link } from "react-router-dom";
import { Layout, Typography } from "antd";
import { Viewer } from "../../lib/types";

interface Props {
    viewer: Viewer;
}

const { Content } = Layout;
const { Text, Title } = Typography;

export const Host = ({ viewer }: Props) => {
    return !viewer.id || !viewer.hasWallet ? (
        <Content className="host-content">
            <div className="host__form-header">
                <Title level={4} className="host__form-title">
                    Sign in and connect with Stripe to host a listing!
                </Title>
                <Text type="secondary">
                    Users must be signed in and connected with Stripe to host 
                    new listings. You can sign in at the{" "}
                    <Link to="/login">login</Link> page and can connect with 
                    Stripe shortly thereafter.
                </Text>
            </div>
        </Content>
    ) : (
        <Content className="host-content">
            <div className="host__form-header">
                <Title level={3} className="host__form-title">
                    Let's get started creating your listing.
                </Title>
                <Text type="secondary">
                    This form is to collect some basic and 
                    additional info about your listing.
                </Text>
            </div>
        </Content>
    );
};

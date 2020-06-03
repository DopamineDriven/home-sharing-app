import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
import { Empty, Layout, Typography } from "antd";

const { Content } = Layout;
const { Text } = Typography;

export const NotFound = () => {
    return (
        <Content className="not-found">
            <Empty 
                description={
                    <Fragment>
                        <Text className="not-found__description-title">
                            Uh Oh! Something went wrong
                        </Text>
                        <Text className="not-found__description-subtitle">
                            Page searched for cannot be found
                        </Text>
                    </Fragment>
                }
            />
            <Link 
                to="/"
                className="not-found__cta ant-btn ant-btn-primary ant-btn-lg"
            >
                Return Home
            </Link>
        </Content>
    );
};

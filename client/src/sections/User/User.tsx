import React from 'react';
import { RouteComponentProps } from "react-router-dom";
import { UserProfile } from "./components";
import { useQuery } from "@apollo/react-hooks";
import { USER } from "../../lib/graphql/queries";
import {
    User as UserData,
    UserVariables
} from "../../lib/graphql/queries/User/__generated__/User";
import { Viewer } from "../../lib/types";
import { Col, Layout, Row } from "antd";

interface Props {
    viewer: Viewer;
}

// (a)
interface MatchParams {
    id: string;
}

// (b) 
const { Content } = Layout;

export const User = ({ viewer, match }: Props & RouteComponentProps<MatchParams>) => {
    const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
        variables: {
            id: match.params.id
        }
    });

    const user = data ? data.user : null;
    const viewerIsUser = viewer.id === match.params.id;

    const userProfileElement = user ? (
        <UserProfile user={user} viewerIsUser={viewerIsUser} />
    ) : null;

    return (
        <Content className="user">
            <Row gutter={12}  justify="space-between">
                <Col xs={24} flex="auto">{userProfileElement}</Col>
            </Row>
        </Content>
    );
};

/*
(a)
query will not run successfully until id value provided that it expects
    This is tricky, however, since user id is available as query param of URL
    How to extrapolate this value?
        React Router provides intuitive way of accessing val of query params
        as a part of props in a component
        <Route /> component in React Router automatically provides a prop known
        as the match prop to the component being rendered
            This prop gives details about the route path for a certain URL
    Extrapolate id from /user/:id
        RouteComponentProps interface -> acts as a generic to shape the props for a route
        Using this, create interface MatchParams; id: string;
        Then, assign type of props as RouteComponentProps<MatchParams>
            can now access match.params.id and pass value of id in useQuery Hook
            match.params.id -> represents the id of the user being queried
*/

/*
(b)
Antd Col grid system -> value of 1-24 (range-spans)
    documentation: https://ant.design/components/grid/
*/
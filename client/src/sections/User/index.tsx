import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { UserBookings, UserListings, UserProfile } from "./components";
import { useQuery } from "@apollo/react-hooks";
import { useScrollToTop } from "../../lib/hooks";
import { USER } from "../../lib/graphql/queries/index";
import {
    User as UserData,
    UserVariables
} from "../../lib/graphql/queries/User/__generated__/User";
import { Viewer } from "../../lib/types";
import { Col, Layout, Row } from "antd";
import { ErrorBanner, PageSkeleton } from "../../lib/components";

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

// (a)
interface MatchParams {
    id: string;
}

// (b) 
const { Content } = Layout;

const PAGE_LIMIT = 4;

export const User = ({ 
    viewer,
    setViewer
}: Props) => {
    useScrollToTop();
    const [listingsPage, setListingsPage] = useState(1);
    const [bookingsPage, setBookingsPage] = useState(1);

    const { id } = useParams<MatchParams>();

    const { data, loading, error, refetch } = useQuery<UserData, UserVariables>(
        USER, {
            variables: {
                id,
                bookingsPage,
                listingsPage,
                limit: PAGE_LIMIT
            },
            fetchPolicy: "cache-and-network"
        }
    );

    const handleUserRefetch = async () => {
        await refetch();
    }

    // URL constructor (for redirect to user on error from Stripe component)
    const stripeError = new URL(window.location.href).searchParams.get("stripe_error");
    const stripeErrorBanner = stripeError ? (
        <ErrorBanner description="Error connecting with Stripe; please try again" />
    ) : null;

    const user = data ? data.user : null;
    const viewerIsUser = viewer.id === id;

    const userListings = user ? user.listings : null;
    const userBookings = user ? user.bookings : null;

    const userProfileElement = user ? (
        <UserProfile 
            user={user}
            viewer={viewer} 
            viewerIsUser={viewerIsUser}
            setViewer={setViewer}
            handleUserRefetch={handleUserRefetch}
        />
    ) : null;

    const userListingsElement = userListings ? (
        <UserListings 
            userListings={userListings}
            listingsPage={listingsPage}
            limit={PAGE_LIMIT}
            setListingsPage={setListingsPage}
        />
    ) : null;

    const userBookingsElement = userBookings ? (
        <UserBookings 
            userBookings={userBookings}
            bookingsPage={bookingsPage}
            limit={PAGE_LIMIT}
            setBookingsPage={setBookingsPage}
        />
    ) : null;

	return loading ? (
        <Content className="user">
            <PageSkeleton />
        </Content>
	) : error ? (
        <Content className="user">
            <ErrorBanner description="user may not exist or an error occurred; please try again" />
            <PageSkeleton />
        </Content>
	) : (
        <Content className="user">
            {stripeErrorBanner}
            <Row gutter={12}  justify="space-between">
                <Col xs={24} flex="auto">{userProfileElement}</Col>
                <Col xs={24}>
                    {userListingsElement}
                    {userBookingsElement}
                </Col>
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
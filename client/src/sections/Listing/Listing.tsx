import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Col, Layout, Row } from "antd";
import { ListingBookings, ListingDetails } from "./components";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { LISTING } from "../../lib/graphql/queries";
import { 
    Listing as ListingData,
    ListingVariables
} from "../../lib/graphql/queries/Listing/__generated__/Listing";

interface MatchParams {
    id: string;
}

const { Content } = Layout;
const PAGE_LIMIT = 3;

export const Listing = ({ match }: RouteComponentProps<MatchParams>) => {
    const [bookingsPage, setBookingsPage] = useState(1);

    const { data, loading, error } = useQuery<ListingData, ListingVariables>(LISTING, {
        variables: {
            id: match.params.id,
            bookingsPage,
            limit: PAGE_LIMIT
        }
    });

    const listing = data ? data.listing : null;
    
    const listingBookings = listing ? listing.bookings : null;
    
    const listingDetailsElement = listing ? <ListingDetails listing={listing} /> : null;

    const listingBookingsElement = listingBookings ? (
        <ListingBookings 
            listingBookings={listingBookings}
            bookingsPage={bookingsPage}
            limit={PAGE_LIMIT}
            setBookingsPage={setBookingsPage}
        />
    ) : null;


    return loading ? (
        <Content className="listings">
            <PageSkeleton />
        </Content>
	) : error ? (
        <Content className="listing">
            <ErrorBanner description="listing may not exist or an error occurred; please try again" />
            <PageSkeleton />
        </Content>
	) : (
        <Content className="listings">
            <Row gutter={24} justify="space-between">
                <Col xs={24} lg={14} flex="auto">
                    {listingDetailsElement}
                    {listingBookingsElement}
                </Col>
            </Row>
        </Content>
    )
};

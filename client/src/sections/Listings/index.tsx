import React, { useState, useEffect, useRef } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { useScrollToTop } from "../../lib/hooks";
import { Affix, Layout, List, Typography } from "antd";
import { ErrorBanner, ListingCard } from "../../lib/components";
import { LISTINGS } from "../../lib/graphql/queries";
import {
    Listings as ListingsData,
    ListingsVariables
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { ListingsFilter } from '../../lib/graphql/globalTypes';
import { ListingsFilters, ListingsPagination, ListingsSkeleton } from "./components";


interface MatchParams {
    location: string;
}

const PAGE_LIMIT = 6;

const { Paragraph, Text, Title } = Typography;
const { Content } = Layout;
const { PRICE_LOW_TO_HIGH } = ListingsFilter; //enum

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
    useScrollToTop();
    // (a)
    const locationRef = useRef(match.params.location);
    const [filter, setFilter] = useState(PRICE_LOW_TO_HIGH);
    const [page, setPage] = useState(1);

    const { data, error, loading } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
        skip: locationRef.current !== match.params.location && page !== 1,
        variables: {
            location: match.params.location,
            filter, // obj shorthand syntax (OSS)
            limit: PAGE_LIMIT,
            page // OSS
        }
    });
    // effect runs on location param change
    useEffect(() => {
        setPage(1);
        locationRef.current = match.params.location;
    }, [match.params.location]);

    const listings = data ? data.listings : null;
    const listingsRegion = listings ? listings.region : null;

    const listingsSectionElement = 
        listings && listings.result.length ? (
            <div>
                <Affix offsetTop={64}>
                    <ListingsPagination
                        total={listings.total}
                        page={page}
                        limit={PAGE_LIMIT}
                        setPage={setPage}
                    />
                    <ListingsFilters filter={filter} setFilter={setFilter} />
                </Affix>
                <List 
                    grid={{
                        gutter: 8,
                        xs: 1,
                        sm: 2,
                        lg: 4
                    }}
                    dataSource={listings.result}
                    renderItem={listing => (
                        <List.Item>
                            <ListingCard listing={listing} />
                        </List.Item>
                    )}
                />
            </div>
        ) : (
            <div>
                <Paragraph>
                    Listings have yet to be created for {" "}
                    <Text mark>"{listingsRegion}"</Text>
                </Paragraph>
                <Paragraph>
                    Be the first to create a <Link to="/host">listing in this area</Link>!
                </Paragraph>
            </div>
        );

    const listingsRegionElement = listingsRegion ? (
        <Title className="listings__title" level={3}>
            Results for "{listingsRegion}"
        </Title>
    ) : null;

    const errorMessage=`parameter(s) input triggered an error; please try searching by city, province/territory/state, or country`;

    return loading ? (
        <Content className="listings">
            <ListingsSkeleton />
        </Content>
	) : error ? (
        <Content className="listings">
            <ErrorBanner description={errorMessage} />
            <ListingsSkeleton />
        </Content>
	) : (
        <Content className="listings">
            {listingsRegionElement}
            {listingsSectionElement}
        </Content>
    );
};

// Affix persists Filter and pagination options on scroll,
// anchoring child props to top of screen (64->64px) 

/*
(a)
    adding useRef after establishing useEffect hook necessary
    why?
        Two network requests were being made on change despite the fact that
        navigating from page 2 of listings to another location returned page 1
        as intended
        that is, variables in queries are being updated twice
            (1) location changes (query)
            (2) then, effect runs and page reset to one for new location
    useRef -> skip first request under condition that page is updated back to 1
    via useEffect; that is, skip initial location change network request
    How to achieve?
        Via Apollo's skip property -> skip:boolean
            if skip is true, query will be skipped entirely
            https://www.apollographql.com/docs/react/api/react-apollo/
        useRef keeps context of location
    The end result
        network req is skipped if locationRef.current !== current location && page !== 1
        locationRef.current passed in useEffect hook to update current location each time
*/
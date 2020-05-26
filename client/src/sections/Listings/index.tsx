import React, { useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
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

const PAGE_LIMIT = 8;

const { Paragraph, Text, Title } = Typography;
const { Content } = Layout;
const { PRICE_LOW_TO_HIGH } = ListingsFilter; //enum

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
    const [filter, setFilter] = useState(PRICE_LOW_TO_HIGH);
    const [page, setPage] = useState(1);

    const { data, error, loading } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
        variables: {
            location: match.params.location,
            filter, // obj shorthand syntax (OSS)
            limit: PAGE_LIMIT,
            page // OSS
        }
    });

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

    const errorMessage=`search parameters triggered an error; ${<br/>} please try again by city, province/territory/state, or country`;

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
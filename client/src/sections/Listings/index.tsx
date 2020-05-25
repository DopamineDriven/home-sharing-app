import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Layout, List } from "antd";
import { ListingCard } from "../../lib/components";
import { LISTINGS } from "../../lib/graphql/queries";
import {
    Listings as ListingsData,
    ListingsVariables
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { ListingsFilter } from "../../lib/graphql/globalTypes";

interface MatchParams {
    location: string;
}

const { Content } = Layout;
const PAGE_LIMIT = 8;

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
    const { data } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
        variables: {
            location: match.params.location,
            filter: ListingsFilter.PRICE_LOW_TO_HIGH,
            limit: PAGE_LIMIT,
            page: 1
        }
    });

    const listings = data ? data.listings : null;
    const listingsSectionElement = listings ? (
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
    ) : null;


    return (
        <Content className="listings">
            {listingsSectionElement}
        </Content>
    );
};
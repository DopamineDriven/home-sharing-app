import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Layout } from "antd";
import { PageSkeleton } from "../../lib/components";
import { LISTING } from "../../lib/graphql/queries";
import { 
    Listing as ListingData,
    ListingVariables
} from "../../lib/graphql/queries/Listing/__generated__/Listing";

interface MatchParams {
    id: string;
}

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


    return (
        <h2>Listing</h2>
    )
};

import React from "react";
import { ListingCard } from "../../../../lib/components";
import { User } from "../../../../lib/graphql/queries/User/__generated__/User";
import { List, Typography } from "antd";

interface Props {
    userListings: User["user"]["listings"];
    listingsPage: number;
    limit: number;
    setListingsPage: (page: number) => void;
}

const { Paragraph, Title } = Typography;

export const UserListings = ({
    userListings,
    listingsPage,
    limit,
    setListingsPage
}: Props) => {
    const { total, result } = userListings;

    const userListingsList = (
        <List 
            grid={{
                gutter: 8,
                xs: 1,
                sm: 2,
                lg: 4
            }}
            dataSource={result}
            pagination={{
                position: "top",
                current: listingsPage,
                total,
                defaultPageSize: limit,
                hideOnSinglePage: true,
                showLessItems: true,
                onChange: (page: number) => setListingsPage(page)
            }}
            renderItem={userListing => (
                <List.Item>
                    <ListingCard listing={userListing} />
                </List.Item>
            )}
        />
    );

    return (
        <div className="user-listings">
            <Title level={4} className="user-listings__title">
                Listings
            </Title>
            <Paragraph className="user-listings__description">
                This section outlines user-hosted listings that are available to book. 
            </Paragraph>
            {userListingsList}
        </div>
    );
};

/*
Ant Design GRID -- https://ant.design/components/grid/
    - gutter property - introduces spacing between cols-> value of 8 (out of 24)
    - dataSource - data to use for list -> [result] from userListings object; list of listings
    - locale - text string for empty lists; !listings ? pass emptyText field : listings;  
    - pagination - pass an object and the fields to configure to this
        - position: "top" -> sticky top
        - current -> references current page given a value of listingsPage prop
        - total -> references total items to be paginated given a value of total field from query
        - defaultPageSize -> default page size; pass a value of the limit prop (4 pages)
        - hideOnSinglePage -> hide pagination element when only 1 page; set to true
        - showLessItems -> constructs pagination element such that not all page numbers
            are shown for very large lists; only surrounding pages and periphery pages shown
        - onChange() cb func -> runs when user clicks a page number
            declare onChange() callback func
            take the payload of the callback (the new page number)
            run the setListingsPage() func to update listingsPage state value in parent
    - renderItem - takes every item in data source and determines UI to be displayed for each item
        render <ListingCard /> component for each item passing the iterated listing as props
        declare rendered <ListindCard /> within the <List.Item /> component
*/

// antd list --- https://ant.design/components/list/#List
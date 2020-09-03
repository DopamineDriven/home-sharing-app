import React from "react";
import { List, Typography } from "antd";
import { ListingCard } from "../../../../lib/components/ListingCard";
import { Listings } from '../../../../lib/graphql/queries/Listings/__generated__/Listings';

interface Props {
    title: string;
    listings: Listings["listings"]["result"];
}

const { Title } = Typography;
const { Item } = List;

export const HomeListings = ({ title, listings }: Props) => {
    return (
        <div className="home-listings">
            <Title level={4} className="home-listings__title">
                {title}
            </Title>
            <List 
                grid={{
                    gutter: 8,
                    xs: 1,
                    sm: 2,
                    lg: 4
                }}
                dataSource={listings}
                renderItem={listing => (
                    <Item>
                        <ListingCard listing={listing} />
                    </Item>
                )}
            />
        </div>
    );
};

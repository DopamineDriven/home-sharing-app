import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Divider, Tag, Typography } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Listing as ListingData } from "../../../../lib/graphql/queries/Listing/__generated__/Listing";
import { iconColor } from "../../../../lib/utils";

// (a)
interface Props {
	listing: ListingData["listing"];
}

const { Paragraph, Title } = Typography;

export const ListingDetails = ({ listing }: Props) => {
	const {
		title,
		description,
		image,
		type,
		address,
		city,
		numOfGuests,
		host
    } = listing;
    
    return (
        <div className="listing-details">
            <div 
                style={{ backgroundImage: `url(${image})` }}
                className="listing-details__image" 
            />
            <div className="listing-details__information">
                <Paragraph
                    className="listing-details__city-address"
                    type="secondary"
                    ellipsis
                >
                    <Link to={`/listings/${city}`}>
                        <EnvironmentOutlined 
                            style={{ 
                                color: iconColor,
                                display: "inline-block", 
                                verticalAlign: "middle"  
                            }} 
                        />
                        {city}
                    </Link>
                    <Divider type="vertical" />
                    {address}
                </Paragraph>
                <Title level={3} className="listing-details__title">
                    {title}
                </Title>
            </div>

            <Divider />

            <div className="listing-details__section">
                <Link to={`/user/${host.id}`}>
                    <Avatar src={host.avatar} size={64} />
                    <Title level={2} className="listing-details__host-name">
                        {host.name}
                    </Title>
                </Link>
            </div>

            <Divider />

            <div className="listing-details__section">
                <Title level={4}>
                    About this space
                </Title>
                <div className="listing-details__about-items">
                    <Tag color="magenta">{type}</Tag>
                    <Tag color="magenta">{numOfGuests} Guests</Tag>
                </div>
                <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                    {description}
                </Paragraph>
            </div>
        </div>
    );
};

/*
(a)
type of listing prop -> type of listing obj from GQL data returned
TS's capability of indexed access types (lookup tyoes) achieves this
*/


/*
export const LISTING = gql`
    query Listing($id: ID!, $bookingsPage: Int!, $limit: Int!) {
        listing(id: $id) {
            id
            title
            description
            image
            host {
                id
                name
                avatar
                hasWallet
            }
            type
            address
            city
            bookings(limit: $limit, page: $bookingsPage) {
                total
                result {
                    id
                    tenant {
                        id
                        name
                        avatar
                    }
                    checkIn
                    checkOut
                }
            }
            bookingsIndex
            price
            numOfGuests
        }
    }
`;
*/
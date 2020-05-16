import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Listings as ListingsData } from "./__generated__/Listings";
import {
	DeleteListing as DeleteListingData,
	DeleteListingVariables,
} from "./__generated__/DeleteListing";
import { Alert, Avatar, Button, List, Spin } from "antd";
import "./styles/Listings.css";
import { ListingsSkeleton } from "./components";

// gql tag parses strings as GraphQL Abstrat Syntax Trees
const LISTINGS = gql`
	query Listings {
		listings {
			id
			title
			image
			address
			price
			numOfGuests
			numOfBeds
			numOfBaths
			rating
		}
	}
`;

// construct query doc of deleteListing mutation
const DELETE_LISTING = gql`
	mutation DeleteListing($id: ID!) {
		deleteListing(id: $id) {
			id
		}
	}
`;
// in gql, can use $ syntax to define vars in a gql request
// can pass the vars as a separate map into the request field

interface Props {
	title: string;
}

export const Listings = ({ title }: Props) => {
	const { data, error, loading, refetch } = useQuery<ListingsData>(LISTINGS);

	// useMutation React Apollo hook returns a tuple -> (1) mutation func (2) result options
	const [
		deleteListing,
		{ loading: deleteListingLoading, error: deleteListingError }
	] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

	const handleDeleteListing = async (id: string) => {
		await deleteListing({ variables: { id } });
		refetch();
	};

	const listings = data ? data.listings : null;

	const listingsList = listings ? (
		<List
			itemLayout="horizontal"
			dataSource={listings}
			renderItem={(listing) => (
				<List.Item
					actions={[
						<Button
							type="primary"
							onClick={() => handleDeleteListing(listing.id)}
						>
							Delete
						</Button>
					]}
				>
					<List.Item.Meta
						title={listing.title}
						description={listing.address}
						avatar={<Avatar src={listing.image} shape="square" size={48} />}
					/>
				</List.Item>
			)}
		/>
	) : null;

	const deleteListingErrorAlert = deleteListingError ? (
		<Alert
			type="error"
			message="Oops! Something went wrong during the delete process. Please try again."
			className="listings__alert"
		/>
	) : null;

	return loading ? (
		<div className="listings">
			<ListingsSkeleton title={title} />
		</div>
	) : error ? (
		<div className="listings">
			<ListingsSkeleton title={title} error />
		</div>
	) : (
		<div className="listings">
			{deleteListingErrorAlert}
			<Spin spinning={deleteListingLoading}>
				<h2>{title}</h2>
				{listingsList}
			</Spin>
		</div>
	);
};

/*
(a)
	pass in data type -> define type of data being returned
	pass in variable type -> constrict shape of vars request expects
	not every req needs vars which is why var request in fields is optional
*/

// useEffect(() => {
// 	fetchListings();
// 	listings && listings.length
// 		? console.log("Listings Exist")
// 		: console.log("Listings Do Not Exist");
// }, [listings]);

/*
able to trim out with useQuery

	const [listings, setListings] = useState<Listing[] | null>(null);

	useEffect(() => {
		fetchListings();

	}, []);

	const fetchListings = async () => {
		// pass ListingsData interface as type variable for server.fetch
		const { data } = await server.fetch<ListingsData>({
			query: LISTINGS
		});
		setListings(data.listings);
	};
*/

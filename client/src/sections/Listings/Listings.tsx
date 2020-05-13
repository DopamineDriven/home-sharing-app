import React from "react";
import { server } from "../../lib/api";
import { 
	ListingsData,
	DeleteListingData,
	DeleteListingVariables
 } from "./types";

// listings var in typescript code, below is query keyword
// query Listings is for the sake of formality
const LISTINGS = `
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
const DELETE_LISTING = `
	mutation DeleteListing($id: ID!) {
		deleteListing(id: $id) {
			id
		}
	}
`;
// in gql, can use $ syntax to define vars in a gql request
// can pass the vars as a separate map into the request field

interface Props {
	title: string | object;
}

export const Listings = ({ title }: Props) => {
	const fetchListings = async () => {
        // pass ListingsData interface as type variable for server.fetch
		const { data } = await server.fetch<ListingsData>({ 
            query: LISTINGS 
        });
		console.log(data);
	};
	const deleteListing = async () => {
		const { data } = await server.fetch<
		// pass in data type -> define type of data being returned
		// pass in variable type -> constrict shape of vars request expects
		// not every req needs vars which is why var request in fields is optional
			DeleteListingData,
			DeleteListingVariables
		>({
			query: DELETE_LISTING,
			variables: {
				id: "5eb8fa41a4d2eb7918137dc3"
			}
		});
		console.log(data)
	}
	return (
		<div>
			<h2>{title}</h2>
			<button
				onClick={fetchListings}
				className="btn btn-dark bg-white text-dark btn-lg ml-5"
			>
				Query Listings
			</button>
			<button
				onClick={deleteListing}
				className="btn btn-dark bg-white text-dark btn-lg ml-5"
			>
				Delete a Listing
			</button>
		</div>
	);
};

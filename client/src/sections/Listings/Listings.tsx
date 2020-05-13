import React from "react";
import { server } from "../../lib/api";
import { ListingsData } from "./types";

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

interface Props {
	title: string | object;
}

export const Listings = ({ title }: Props) => {
	const fetchListings = async () => {
        // pass ListingsData interface as type variable for server.fetch
		const { data } = await server.fetch<ListingsData>({ 
            query: LISTINGS 
        });
		console.log(data.listings);
	};
	return (
		<div>
			<h2>{title}</h2>
			<button
				onClick={fetchListings}
				className="btn btn-dark bg-white text-dark btn-lg ml-5"
			>
				Query Listings
			</button>
		</div>
	);
};
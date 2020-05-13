import React from "react";
import { useQuery, useMutation } from "../../lib/api";
import {
	ListingsData,
	DeleteListingData,
	DeleteListingVariables,
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
	const { data, error, loading, refetch } = useQuery<ListingsData>(LISTINGS);

// destructuring vals from useMutation array->can name value as desired
// load and error destructed from state obj
	const [
		deleteListing,
		{ loading: deleteListingLoading, error: deleteListingError }
	] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING)

	const handleDeleteListing = async (id: string) => {
		await deleteListing({ id })
		refetch();
	};

	const listings = data ? data.listings : null;

	const listingsList = listings ? (
		<ul>
			{listings?.map((listing) => {
				return (
					<li key={listing.id} className="list-group-item">
						<button
							onClick={() => handleDeleteListing(listing.id)}
							className="btn btn-dark bg-white text-primary btn-sm mb-1 mr-2"
						>
							Delete Listing
						</button>
						{listing.title}&nbsp;&nbsp;{"|"}&nbsp;&nbsp;{"rating: "}
						{listing.rating}{"/5"}
					</li>
				);
			})}
		</ul>
	) : null;

	const deleteListingLoadingMessage = deleteListingLoading ? (
		<h4>Deletion in Progress...</h4>
	) : null;

	const deleteListingErrorMessage = deleteListingError ? (
		<h4>Oops! Something went wrong during the delete process. Please try again.</h4>
	) : null;

	return loading ? (
		<div className="m-5">
			<h2>Loading...</h2>
		</div>
	) : error ? (
		<div className="m-5">
			<h2>Oops! Something went wrong</h2>
		</div>
	) : (
		<div className="m-5">
			<h2>{title}</h2>
			{listingsList}
			{deleteListingLoadingMessage}
			{deleteListingErrorMessage}
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

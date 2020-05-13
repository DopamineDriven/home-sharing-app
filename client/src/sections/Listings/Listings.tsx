import React from 'react';
import { server } from "../../lib/api";

interface Props {
    title: string|object
};

export const Listings = ({ title }: Props) => {
    const fetchListings = () => {}
    return (
        <div>
            <h2>
                {title}
            </h2>
            <button 
                onClick={fetchListings}
                className="btn btn-dark bg-white text-dark btn-lg"
            >
                Query Listings
            </button>
        </div>
    )
};
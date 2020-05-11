import React from 'react';

interface Props {
    title: string|object
};

export const Listings = ({ title }: Props) => {
    return (
        <h2>
            {title}
        </h2>
    )
};

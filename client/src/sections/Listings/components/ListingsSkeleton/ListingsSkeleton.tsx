import React from 'react';
import { Alert, Divider, Skeleton } from 'antd';
import './styles/ListingsSkeleton.css';

interface Props {
    title: string;
    error?: boolean;
}

export const ListingsSkeleton = ({ title, error = false }: Props) => {
    const errorAlert = error ? (
        <Alert 
            type="error"
            message="Oops! Something went wrong, please try again."
            className="listings-skeleton__alert"
        />
    ) : null;
    
    return (
        <div className="listings-skeleton">
            {errorAlert}
            <h2>{title}</h2>
            <Skeleton active paragraph={{ rows: 1 }} />
            <Divider />
            <Skeleton active paragraph={{ rows: 1 }} />
            <Divider />
            <Skeleton active paragraph={{ rows: 1 }} />
        </div>
    );
};

// has a parahgrap prop that takes an obj and controls the number
    // of rows being displayed
// single row for paragraph specified
    // active prop to give rise to an active blinking state

/*
Note:
    To mimic a list of three items, two more identical skeleton
    components must be rendered

    Insert a divider component between each row (similar to <hr/>)
*/

/*
Note -> Alert:
    - conditionally render Alert component when error prop is true
        - alert has type prop given a value of "error" in addition to
        the appropriate message prop
*/
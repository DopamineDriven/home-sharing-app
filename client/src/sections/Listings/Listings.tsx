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

// export const Listings2: FunctionComponent<Props> = ({ title }) => {
//     return (
//         <h2>
//             {title}
//         </h2>
//     )
// }

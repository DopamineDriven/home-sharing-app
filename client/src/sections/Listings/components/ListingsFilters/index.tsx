import React from "react";
import { Select } from "antd";
import { ListingsFilter } from "../../../../lib/graphql/globalTypes";

interface Props {
    filter: ListingsFilter;
    setFilter: (filter: ListingsFilter) => void;
}

const { Option } = Select;

export const ListingsFilters = () => {
    return <h2>listingsF</h2>
};
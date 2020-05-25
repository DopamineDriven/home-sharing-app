import React from "react";
import { Select } from "antd";
import { ListingsFilter } from "../../../../lib/graphql/globalTypes";

interface Props {
    filter: ListingsFilter;
    setFilter: (filter: ListingsFilter) => void;
}

const { Option } = Select;
const { PRICE_HIGH_TO_LOW, PRICE_LOW_TO_HIGH } = ListingsFilter;

export const ListingsFilters = ({ filter, setFilter }: Props) => {
    return (
        <div className="listings-filters">
            <span>Filter</span>
            <Select
                value={filter}
                onChange={(filter: ListingsFilter) => setFilter(filter)}
            >
                <Option value={PRICE_LOW_TO_HIGH}>
                    Price: Low to High
                </Option>
                <Option value={PRICE_HIGH_TO_LOW}>
                    Price: High to Low
                </Option>
            </Select>
        </div>
    );
};
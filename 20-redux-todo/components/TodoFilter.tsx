import React from "react";
import { FilterChangeListener, FilterType } from "../model/shared-types";
import { TodoStatus } from "../model/todo.model";

interface TodoFilterProps {
    filter: FilterType;
    onFilterChange: FilterChangeListener;
}

export default function TodoFilter({filter, onFilterChange}: TodoFilterProps) {
    function handleFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
        onFilterChange(event.target.value === '0'? undefined: parseInt(event.target.value))
    }
    return (
        <select value={filter} onChange={handleFilterChange} className="TodoFilter">
            <option value='0'>All</option>
            <option value={TodoStatus.Active}>Active</option>
            <option value={TodoStatus.Completed}>Completed</option>
            <option value={TodoStatus.Canceled}>Canceled</option>
        </select>

    );
}
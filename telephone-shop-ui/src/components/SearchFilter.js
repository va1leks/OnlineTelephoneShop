import React, { useState } from 'react';

const SearchFilter = ({ onFilter }) => {
    const [filters, setFilters] = useState({
        model: '',
        brand: '',
        color: '',
        status: '',
        price: '',
        storage: '',
        processor: '',
        searchTerm: ''
    });

    const handleChange = (e) => {
        const newFilters = {
            ...filters,
            [e.target.name]: e.target.value
        };
        setFilters(newFilters);
        onFilter(newFilters);
    };

    const clearFilters = () => {
        const emptyFilters = {
            model: '',
            brand: '',
            color: '',
            status: '',
            price: '',
            storage: '',
            processor: '',
            searchTerm: ''
        };
        setFilters(emptyFilters);
        onFilter(emptyFilters);
    };

    return (
        <div className="search-filter">
            <div className="filter-group">
                <input
                    type="text"
                    name="searchTerm"
                    placeholder="Поиск по модели, бренду..."
                    value={filters.searchTerm}
                    onChange={handleChange}
                    className="search-input"
                />
            </div>

            <div className="filter-row">
                <select name="brand" value={filters.brand} onChange={handleChange}>
                    <option value="">Все бренды</option>
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Huawei">Huawei</option>
                </select>

                <select name="status" value={filters.status} onChange={handleChange}>
                    <option value="">Любой статус</option>
                    <option value="Available">В наличии</option>
                    <option value="Out of stock">Нет в наличии</option>
                </select>

                <input
                    type="number"
                    name="price"
                    placeholder="Макс. цена"
                    value={filters.price}
                    onChange={handleChange}
                />

                <button onClick={clearFilters} className="clear-filters">
                    Очистить
                </button>
            </div>
        </div>
    );
};

export default SearchFilter;
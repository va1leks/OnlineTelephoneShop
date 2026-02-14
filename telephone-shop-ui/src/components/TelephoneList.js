import React, { useState, useEffect } from 'react';
import TelephoneCard from './TelephoneCard';
import SearchFilter from './SearchFilter';

const TelephoneList = ({ telephones, onTelephoneClick, onAddToCart, onRefresh }) => {
    const [filteredTelephones, setFilteredTelephones] = useState(telephones);

    useEffect(() => {
        setFilteredTelephones(telephones);
    }, [telephones]);

    const handleFilter = async (filters) => {
        try {
            const queryParams = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== '') {
                    queryParams.append(key, value);
                }
            });

            const response = await fetch(`http://localhost:8080/telshop/telephones/filter?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFilteredTelephones(data);
            } else {
                // Если фильтрация не работает, применяем фильтры локально
                const filtered = telephones.filter(phone => {
                    return (
                        (!filters.brand || phone.brand?.toLowerCase().includes(filters.brand.toLowerCase())) &&
                        (!filters.model || phone.model?.toLowerCase().includes(filters.model.toLowerCase())) &&
                        (!filters.color || phone.color?.toLowerCase().includes(filters.color.toLowerCase())) &&
                        (!filters.searchTerm ||
                            phone.brand?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                            phone.model?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                            phone.description?.toLowerCase().includes(filters.searchTerm.toLowerCase()))
                    );
                });
                setFilteredTelephones(filtered);
            }
        } catch (error) {
            console.error('Error filtering telephones:', error);
            setFilteredTelephones(telephones);
        }
    };

    return (
        <div className="telephone-list">
            <div className="container">
                <div className="list-header">
                    <h2>Каталог телефонов ({filteredTelephones.length})</h2>
                    <button className="refresh-btn" onClick={onRefresh}>
                        🔄 Обновить
                    </button>
                </div>

                <SearchFilter onFilter={handleFilter} />

                <div className="telephones-grid">
                    {filteredTelephones.map(telephone => (
                        <TelephoneCard
                            key={telephone.id}
                            telephone={telephone}
                            onAddToCart={onAddToCart}
                            onTelephoneClick={onTelephoneClick}
                        />
                    ))}
                </div>

                {filteredTelephones.length === 0 && telephones.length > 0 && (
                    <div className="no-results">
                        <p>По вашему запросу ничего не найдено</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TelephoneList;
// src/pages/TelephoneList.js
import React, { useEffect, useState } from 'react';
import TelephoneCard from '../components/TelephoneCard';
import { fetchTelephones, addTelephoneToCart } from '../services/api';
import './TelephoneList.css'; // Создадим этот файл стилей позже

const CLIENT_ID = 1; // Заглушка. В реальном приложении будет браться из контекста пользователя/сессии

const TelephoneList = () => {
    const [telephones, setTelephones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        brand: '',
        model: '',
        color: '',
        price: '',
        storage: '',
        processor: '',
        searchTerm: ''
    });

    useEffect(() => {
        const getTelephones = async () => {
            try {
                const data = await fetchTelephones(filters);
                setTelephones(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getTelephones();
    }, [filters]); // Перезагружаем телефоны при изменении фильтров

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleAddToCart = async (telephoneId) => {
        try {
            await addTelephoneToCart(CLIENT_ID, telephoneId);
            alert('Телефон добавлен в корзину!');
            // Опционально: обновить состояние корзины или перенаправить пользователя
        } catch (err) {
            alert(`Ошибка при добавлении в корзину: ${err.message}`);
        }
    };

    if (loading) return <div className="loading-message">Загрузка телефонов...</div>;
    if (error) return <div className="error-message">Ошибка: {error}</div>;

    return (
        <div className="telephone-list-page">
            <h2>Все телефоны</h2>

            <div className="filters-container">
                <input
                    type="text"
                    name="searchTerm"
                    placeholder="Поиск по модели, бренду, описанию..."
                    value={filters.searchTerm}
                    onChange={handleFilterChange}
                    className="filter-input search-input"
                />
                <select name="brand" value={filters.brand} onChange={handleFilterChange} className="filter-input">
                    <option value="">Все бренды</option>
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Xiaomi">Xiaomi</option>
                    {/* Добавьте другие бренды */}
                </select>
                <input
                    type="text"
                    name="color"
                    placeholder="Цвет"
                    value={filters.color}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Цена до..."
                    value={filters.price}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <select name="storage" value={filters.storage} onChange={handleFilterChange} className="filter-input">
                    <option value="">Все объемы памяти</option>
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    {/* Добавьте другие объемы */}
                </select>
                <input
                    type="text"
                    name="processor"
                    placeholder="Процессор"
                    value={filters.processor}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
            </div>

            <div className="telephone-grid">
                {telephones.map((telephone) => (
                    <TelephoneCard key={telephone.id} telephone={telephone} onAddToCart={handleAddToCart} />
                ))}
            </div>
        </div>
    );
};

export default TelephoneList;
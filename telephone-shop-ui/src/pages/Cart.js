// src/pages/Cart.js
import React, { useEffect, useState } from 'react';
import { fetchClientCart } from '../services/api';
import { Link } from 'react-router-dom';
import './Cart.css'; // Создадим этот файл стилей позже

const CLIENT_ID = 1; // Заглушка

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCartItems = async () => {
            try {
                const data = await fetchClientCart(CLIENT_ID);
                setCartItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getCartItems();
    }, []);

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);
    };

    if (loading) return <div className="loading-message">Загрузка корзины...</div>;
    if (error) return <div className="error-message">Ошибка: {error}</div>;

    return (
        <div className="cart-page">
            <h2>Ваша корзина</h2>
            {cartItems.length === 0 ? (
                <div className="empty-cart-message">
                    <p>Ваша корзина пуста.</p>
                    <Link to="/telephones" className="back-to-shop-button">Перейти к покупкам</Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-list">
                        {cartItems.map((item) => {
                            const imageUrl = item.images && item.images.length > 0
                                ? item.images.find(img => img.previewImage)?.url || item.images[0].url
                                : 'https://via.placeholder.com/80'; // Заглушка
                            return (
                                <div key={item.id} className="cart-item">
                                    <img src={imageUrl} alt={item.model} className="cart-item-image" />
                                    <div className="cart-item-details">
                                        <h3>{item.brand} {item.model}</h3>
                                        <p>Цена: {item.price} ₽</p>
                                        {/* Здесь можно добавить кнопки для удаления из корзины, изменения количества */}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="cart-summary">
                        <h3>Итого:</h3>
                        <p className="total-price">{calculateTotal()} ₽</p>
                        <Link to="/checkout" className="checkout-button">Оформить заказ</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
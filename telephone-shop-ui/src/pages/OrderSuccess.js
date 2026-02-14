// src/pages/OrderSuccess.js
import React from 'react';
import { Link } from 'react-router-dom';
import './OrderSuccess.css'; // Создадим этот файл стилей позже

const OrderSuccess = () => {
    return (
        <div className="order-success-page">
            <div className="success-card">
                <h2>Ваш заказ успешно оформлен!</h2>
                <p>Спасибо за покупку в нашем магазине.</p>
                <p>Мы свяжемся с вами в ближайшее время для подтверждения деталей.</p>
                <div className="success-actions">
                    <Link to="/telephones" className="action-button primary">Продолжить покупки</Link>
                    <Link to="/" className="action-button secondary">На главную</Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
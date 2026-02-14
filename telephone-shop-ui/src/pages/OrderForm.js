// src/pages/OrderForm.js (Продолжение)
import React, { useState, useEffect } from 'react';
import { createOrder, fetchClientCart } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './OrderForm.css';

const CLIENT_ID = 1; // Заглушка. В реальном приложении будет браться из контекста пользователя/сессии

const OrderForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
    });
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitError, setSubmitError] = useState(null); // Для ошибок при отправке формы

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null); // Сброс предыдущих ошибок
        setLoading(true);

        // Преобразование cartItems в формат, ожидаемый бэкендом (Set<AvailableTelephone>).
        // ВАЖНО: Ваша текущая модель Order (Set<AvailableTelephone> telephones)
        // и Telephone (Set<AvailableTelephone> availableTelephones) предполагает,
        // что Order связан не напрямую с Telephone, а с экземплярами AvailableTelephone.
        // Здесь я создаю заглушку. В идеале, когда товар добавляется в корзину,
        // вы должны были бы выбрать конкретный AvailableTelephone для него.
        // Для MVP, я просто создам фиктивные AvailableTelephone на основе телефонов в корзине.
        // Возможно, вам придется скорректировать логику бэкенда или фронтенда здесь.
        const availableTelephonesForOrder = cartItems.map(item => ({
            id: null, // ID будет сгенерирован бэкендом
            telephone: { id: item.id }, // Привязываем к существующему Telephone по ID
            serialNumber: Math.floor(Math.random() * 1000000000), // Заглушка
            status: 'PENDING_ORDER', // Или другой подходящий статус
            currentOrder: null // Будет установлено при сохранении заказа
        }));

        const orderData = {
            ...formData,
            status: 'Pending', // Начальный статус заказа
            telephones: availableTelephonesForOrder // Добавляем телефоны в заказ
        };

        try {
            await createOrder(orderData);
            alert('Заказ успешно оформлен!');
            // Очистка корзины (если реализовано на бэкенде)
            // ИЛИ: Очистка локальной корзины и перенаправление
            setCartItems([]); // Очищаем локальную корзину
            navigate('/order-success'); // Перенаправление на страницу успешного заказа
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-message">Загрузка корзины для оформления заказа...</div>;
    if (error) return <div className="error-message">Ошибка при загрузке корзины: {error}</div>;

    if (cartItems.length === 0) {
        return (
            <div className="order-form-page">
                <h2>Оформление заказа</h2>
                <div className="empty-cart-message">
                    <p>Ваша корзина пуста. Невозможно оформить заказ.</p>
                    <Link to="/telephones" className="back-to-shop-button">Перейти к покупкам</Link>
                </div>
            </div>
        );
    }

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);
    };

    return (
        <div className="order-form-page">
            <h2>Оформление заказа</h2>
            <div className="order-summary">
                <h3>Ваш заказ:</h3>
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>{item.brand} {item.model} - {item.price} ₽</li>
                    ))}
                </ul>
                <p><strong>Итого: {calculateTotal()} ₽</strong></p>
            </div>

            <form onSubmit={handleSubmit} className="order-form">
                <div className="form-group">
                    <label htmlFor="fullName">Ваше ФИО:</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Номер телефона:</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Адрес доставки:</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                    ></textarea>
                </div>

                {submitError && <div className="error-message submit-error">Ошибка при оформлении заказа: {submitError}</div>}

                <button type="submit" className="submit-order-button" disabled={loading}>
                    {loading ? 'Оформление...' : 'Подтвердить заказ'}
                </button>
            </form>
        </div>
    );
};

export default OrderForm;
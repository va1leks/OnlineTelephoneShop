import React, { useState } from 'react';

const OrderForm = ({ onSubmit, onBack, cart }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '+375',
        address: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'ФИО обязательно для заполнения';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Номер телефона обязателен';
        } else if (!formData.phoneNumber.startsWith('+375')) {
            newErrors.phoneNumber = 'Номер должен начинаться с +375';
        } else if (formData.phoneNumber.length < 13) {
            newErrors.phoneNumber = 'Номер телефона должен быть в формате +375XXXXXXXXX';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Адрес обязателен для заполнения';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Создаем массив ID телефонов с учетом количества
            const telephoneIds = [];
            cart.forEach(item => {
                if (item.id && item.id > 0) {
                    const quantity = item.quantity || 1;
                    for (let i = 0; i < quantity; i++) {
                        telephoneIds.push(item.id);
                    }
                }
            });

            if (telephoneIds.length === 0) {
                alert('Нет валидных товаров для заказа');
                return;
            }

            const orderData = {
                ...formData,
                telephoneIds: telephoneIds
            };

            console.log('Submitting order with telephone IDs:', telephoneIds);
            await onSubmit(orderData);
        } catch (error) {
            console.error('Error in order form:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phoneNumber') {
            const cleanedValue = value.replace(/[^\d+]/g, '');
            if (cleanedValue.length <= 13) {
                setFormData({
                    ...formData,
                    [name]: cleanedValue
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handlePhoneFocus = (e) => {
        if (!formData.phoneNumber) {
            setFormData(prev => ({
                ...prev,
                phoneNumber: '+375'
            }));
        }
    };

    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

    const validCartItems = cart.filter(item => item.id && item.id > 0);

    return (
        <div className="order-form">
            <div className="container">
                <div className="form-header">
                    <button className="back-btn" onClick={onBack} disabled={loading}>
                        ← Назад к корзине
                    </button>
                    <h2>Оформление заказа</h2>
                </div>

                <div className="order-summary">
                    <h3>Ваш заказ ({totalItems} товаров)</h3>
                    <div className="order-items">
                        {validCartItems.map(item => (
                            <div key={item.cartId} className="order-item">
                                <div className="order-item-info">
                                    <span className="item-name">{item.brand} {item.model}</span>
                                    {item.quantity > 1 && (
                                        <span className="item-quantity">× {item.quantity}</span>
                                    )}
                                </div>
                                <span className="item-price">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="order-total">
                        Итого: <strong>${totalPrice.toFixed(2)}</strong>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="order-form-content">
                    <div className="form-group">
                        <label htmlFor="fullName">
                            ФИО *
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Введите ваше полное имя"
                            required
                            disabled={loading}
                            className={errors.fullName ? 'error' : ''}
                        />
                        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber">
                            Номер телефона *
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            onFocus={handlePhoneFocus}
                            placeholder="+375XXXXXXXXX"
                            required
                            disabled={loading}
                            className={errors.phoneNumber ? 'error' : ''}
                        />
                        {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                        <div className="phone-format">Формат: +375XXXXXXXXX</div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email
                            <span className="optional-field"> (необязательно)</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">
                            Адрес доставки *
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Введите полный адрес доставки"
                            required
                            disabled={loading}
                            rows="4"
                            className={errors.address ? 'error' : ''}
                        />
                        {errors.address && <span className="error-message">{errors.address}</span>}
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onBack}
                            disabled={loading}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="submit-order-btn"
                            disabled={loading || validCartItems.length === 0}
                        >
                            {loading ? (
                                <>
                                    <div className="button-spinner"></div>
                                    Обработка...
                                </>
                            ) : (
                                `Подтвердить заказ ($${totalPrice.toFixed(2)})`
                            )}
                        </button>
                    </div>

                    {validCartItems.length === 0 && (
                        <div className="empty-cart-warning">
                            ⚠️ Нет валидных товаров для оформления заказа. Добавьте товары из каталога.
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default OrderForm;
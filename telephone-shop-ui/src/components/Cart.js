import React from 'react';

const Cart = ({ cart, onRemove, onClear, onUpdateQuantity, onBack, onOrder }) => {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

    const handleQuantityChange = (cartId, change) => {
        const item = cart.find(item => item.cartId === cartId);
        if (item) {
            const newQuantity = (item.quantity || 1) + change;
            onUpdateQuantity(cartId, newQuantity);
        }
    };

    return (
        <div className="cart">
            <div className="container">
                <div className="cart-header">
                    <button className="back-btn" onClick={onBack}>← Назад в магазин</button>
                    <h2>Корзина</h2>
                </div>

                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <p>Ваша корзина пуста</p>
                        <button className="continue-shopping-btn" onClick={onBack}>
                            Продолжить покупки
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="cart-actions">
                            <button className="clear-cart-btn" onClick={onClear}>
                                Очистить корзину
                            </button>
                        </div>

                        <div className="cart-items">
                            {cart.map(item => (
                                <div key={item.cartId} className="cart-item">
                                    <div className="item-image">
                                        <img
                                            src={item.images?.[0] ? `http://localhost:8080${item.images[0].url}` : 'https://via.placeholder.com/80x60/667eea/ffffff?text=No+Img'}
                                            alt={item.model}
                                        />
                                    </div>
                                    <div className="item-info">
                                        <h4>{item.brand} {item.model}</h4>
                                        <p className="item-color">Цвет: {item.color || 'Не указан'}</p>
                                        <p className="item-storage">Память: {item.storage || 'Не указана'}</p>
                                        <p className="item-price-single">${item.price || 0} за шт.</p>
                                    </div>

                                    <div className="quantity-controls">
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(item.cartId, -1)}
                                        >
                                            -
                                        </button>
                                        <span className="quantity-display">{item.quantity || 1}</span>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(item.cartId, 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="item-total">
                                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                    </div>

                                    <button
                                        className="remove-btn"
                                        onClick={() => onRemove(item.cartId)}
                                        title="Удалить из корзины"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-footer">
                            <div className="total-section">
                                <div className="items-count">
                                    Товаров: <strong>{totalItems} шт.</strong>
                                </div>
                                <div className="total-price">
                                    Общая сумма: <strong>${totalPrice.toFixed(2)}</strong>
                                </div>
                            </div>
                            <button className="order-btn" onClick={onOrder}>
                                Перейти к оформлению
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
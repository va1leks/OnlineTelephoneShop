// App.js (упрощенная версия без админки)
import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Header from './components/Header';
import TelephoneList from './components/TelephoneList';
import TelephoneDetail from './components/TelephoneDetail';
import Cart from './components/Cart';
import OrderForm from './components/OrderForm';
import { getAllTelephones, addToCart, createOrder, getTelephoneById } from './services/api';

function App() {
    const [telephones, setTelephones] = useState([]);
    const [cart, setCart] = useState([]);
    const [currentView, setCurrentView] = useState('list');
    const [selectedTelephone, setSelectedTelephone] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTelephones();

        const savedCart = localStorage.getItem('phoneShopCart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Error loading cart from localStorage:', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('phoneShopCart', JSON.stringify(cart));
    }, [cart]);

    const loadTelephones = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllTelephones();
            setTelephones(data);
        } catch (error) {
            console.error('Error loading telephones:', error);
            setError('Ошибка загрузки данных. Проверьте подключение к серверу.');
        } finally {
            setLoading(false);
        }
    };

    const handleTelephoneClick = async (telephoneId) => {
        try {
            setLoading(true);
            const telephone = await getTelephoneById(telephoneId);
            setSelectedTelephone(telephone);
            setCurrentView('detail');
        } catch (error) {
            console.error('Error loading telephone details:', error);
            const telephone = telephones.find(t => t.id === telephoneId);
            if (telephone) {
                setSelectedTelephone(telephone);
                setCurrentView('detail');
            } else {
                alert('Ошибка загрузки детальной информации');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (telephoneId) => {
        try {
            const clientId = 1;

            try {
                await addToCart(clientId, telephoneId);
            } catch (apiError) {
                console.log('API add to cart failed');
            }

            const telephone = telephones.find(t => t.id === telephoneId);
            if (telephone) {
                setCart(prev => {
                    const newCart = [...prev, {
                        ...telephone,
                        cartId: Date.now() + Math.random()
                    }];
                    return newCart;
                });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleBuyNow = (telephoneId) => {
        const telephone = telephones.find(t => t.id === telephoneId);
        if (telephone) {
            setCart([{
                ...telephone,
                cartId: Date.now() + Math.random()
            }]);
            setCurrentView('cart');
        }
    };

    const handleCreateOrder = async (orderData) => {
        try {
            console.log('Creating order with data:', orderData);

            const orderPayload = {
                phoneNumber: orderData.phoneNumber,
                address: orderData.address,
                fullName: orderData.fullName,
                status: "Pending",
                telephoneIds: orderData.telephoneIds
            };

            console.log('Sending order payload:', orderPayload);

            const result = await createOrder(orderPayload);
            console.log('Order creation result:', result);

            setCart([]);
            localStorage.removeItem('phoneShopCart');

            setCurrentView('list');
            alert('Заказ успешно создан! Номер заказа: ' + (result.id || 'не указан'));
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Ошибка при создании заказа. Пожалуйста, попробуйте еще раз.');
        }
    };

    const removeFromCart = (cartId) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('phoneShopCart');
    };

    const updateCartItemQuantity = (cartId, newQuantity) => {
        setCart(prev => {
            const itemIndex = prev.findIndex(item => item.cartId === cartId);
            if (itemIndex === -1) return prev;

            const newCart = [...prev];
            if (newQuantity <= 0) {
                newCart.splice(itemIndex, 1);
            } else {
                const item = newCart[itemIndex];
                newCart[itemIndex] = {
                    ...item,
                    quantity: newQuantity
                };
            }
            return newCart;
        });
    };

    if (loading && currentView === 'list') {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Загрузка...</p>
            </div>
        );
    }

    if (error && currentView === 'list') {
        return (
            <div className="error-page">
                <Header
                    cartCount={cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                    onCartClick={() => setCurrentView('cart')}
                    onLogoClick={() => setCurrentView('list')}
                />
                <div className="error-message">
                    <h2>Ошибка</h2>
                    <p>{error}</p>
                    <button onClick={loadTelephones} className="retry-btn">
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            <Header
                cartCount={cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                onCartClick={() => setCurrentView('cart')}
                onLogoClick={() => setCurrentView('list')}
            />

            {currentView === 'list' && (
                <TelephoneList
                    telephones={telephones}
                    onTelephoneClick={handleTelephoneClick}
                    onAddToCart={handleAddToCart}
                    onRefresh={loadTelephones}
                />
            )}

            {currentView === 'detail' && selectedTelephone && (
                <TelephoneDetail
                    telephone={selectedTelephone}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onBack={() => setCurrentView('list')}
                />
            )}

            {currentView === 'cart' && (
                <Cart
                    cart={cart}
                    onRemove={removeFromCart}
                    onClear={clearCart}
                    onUpdateQuantity={updateCartItemQuantity}
                    onBack={() => setCurrentView('list')}
                    onOrder={() => setCurrentView('order')}
                />
            )}

            {currentView === 'order' && (
                <OrderForm
                    onSubmit={handleCreateOrder}
                    onBack={() => setCurrentView('cart')}
                    cart={cart}
                />
            )}
        </div>
    );
}

export default App;
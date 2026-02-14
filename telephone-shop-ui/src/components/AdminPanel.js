import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const API_BASE = 'http://localhost:8080/telshop';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('telephones');
    const navigate = useNavigate();

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <button
                    onClick={() => navigate('/')}
                    className="btn btn-back"
                >
                    ← В магазин
                </button>
                <h1>Панель администратора</h1>
            </div>

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'telephones' ? 'active' : ''}`}
                    onClick={() => setActiveTab('telephones')}
                >
                    📱 Управление телефонами
                </button>
                <button
                    className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    📋 Управление заказами
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'telephones' && <TelephoneManagement />}
                {activeTab === 'orders' && <OrderManagement />}
            </div>
        </div>
    );
};

// Компонент для управления телефонами
const TelephoneManagement = () => {
    const [telephones, setTelephones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingTelephone, setEditingTelephone] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        model: '',
        brand: '',
        color: '',
        description: '',
        price: '',
        size: '',
        weight: '',
        display: '',
        camera: '',
        storage: '',
        connection: '',
        processor: '',
        status: 'Available'
    });
    const [images, setImages] = useState({ file1: null, file2: null });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadTelephones();
    }, []);

    const loadTelephones = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/telephones/all`);
            if (!response.ok) {
                throw new Error('Ошибка загрузки телефонов');
            }
            const data = await response.json();
            setTelephones(data);
        } catch (error) {
            console.error('Error loading telephones:', error);
            alert('Ошибка загрузки телефонов');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e, imageKey) => {
        setImages(prev => ({
            ...prev,
            [imageKey]: e.target.files[0]
        }));
    };

    const validateForm = () => {
        if (!formData.model.trim()) {
            alert('Модель обязательна для заполнения');
            return false;
        }
        if (!formData.brand.trim()) {
            alert('Бренд обязателен для заполнения');
            return false;
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            alert('Цена должна быть положительным числом');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Подготовка данных для отправки
            const submitData = {
                model: formData.model,
                brand: formData.brand,
                color: formData.color || '',
                description: formData.description || '',
                price: formData.price ? parseFloat(formData.price) : 0,
                size: formData.size || '',
                weight: formData.weight ? parseFloat(formData.weight) : null,
                display: formData.display || '',
                camera: formData.camera || '',
                storage: formData.storage || '',
                connection: formData.connection || '',
                processor: formData.processor || '',
                status: formData.status || 'Available'
            };

            console.log('Отправляемые данные:', submitData);

            const formDataToSend = new FormData();

            // Добавляем телефон как JSON
            formDataToSend.append('telephone', new Blob([JSON.stringify(submitData)], {
                type: 'application/json'
            }));

            // Добавляем изображения только если они выбраны
            if (images.file1) {
                formDataToSend.append('file1', images.file1);
            }
            if (images.file2) {
                formDataToSend.append('file2', images.file2);
            }

            const url = editingTelephone
                ? `${API_BASE}/telephones/update/${editingTelephone.id}`
                : `${API_BASE}/telephones/create`;

            const method = editingTelephone ? 'PUT' : 'POST';

            console.log('URL:', url, 'Method:', method);

            const response = await fetch(url, {
                method: method,
                body: formDataToSend
                // Не устанавливаем Content-Type - браузер сделает это автоматически для FormData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Успех:', result);

            resetForm();
            loadTelephones();
            alert(editingTelephone ? 'Телефон обновлен!' : 'Телефон добавлен!');

        } catch (error) {
            console.error('Error saving telephone:', error);
            alert(`Ошибка при сохранении телефона: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (telephone) => {
        console.log('Редактирование телефона:', telephone);
        setEditingTelephone(telephone);
        setFormData({
            model: telephone.model || '',
            brand: telephone.brand || '',
            color: telephone.color || '',
            description: telephone.description || '',
            price: telephone.price || '',
            size: telephone.size || '',
            weight: telephone.weight || '',
            display: telephone.display || '',
            camera: telephone.camera || '',
            storage: telephone.storage || '',
            connection: telephone.connection || '',
            processor: telephone.processor || '',
            status: telephone.status || 'Available'
        });
        setImages({ file1: null, file2: null });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот телефон?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/telephones/delete/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Ошибка при удалении');
            }

            loadTelephones();
            alert('Телефон удален!');
        } catch (error) {
            console.error('Error deleting telephone:', error);
            alert('Ошибка при удалении телефона');
        }
    };

    const resetForm = () => {
        setFormData({
            model: '',
            brand: '',
            color: '',
            description: '',
            price: '',
            size: '',
            weight: '',
            display: '',
            camera: '',
            storage: '',
            connection: '',
            processor: '',
            status: 'Available'
        });
        setImages({ file1: null, file2: null });
        setEditingTelephone(null);
        setShowForm(false);
    };

    const filteredTelephones = telephones.filter(telephone =>
        telephone.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        telephone.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        telephone.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="telephone-management">
            <div className="management-header">
                <h2>Управление телефонами</h2>
                <div className="management-controls">
                    <input
                        type="text"
                        placeholder="Поиск телефонов..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button onClick={loadTelephones} className="btn btn-secondary">
                        Обновить
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        Добавить телефон
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content large-modal">
                        <div className="modal-header">
                            <h2>{editingTelephone ? 'Редактировать телефон' : 'Добавить телефон'}</h2>
                            <button onClick={resetForm} className="close-btn">×</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit} className="telephone-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Модель *</label>
                                        <input
                                            type="text"
                                            name="model"
                                            value={formData.model}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="iPhone 15 Pro"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Бренд *</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Apple"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Цвет</label>
                                        <input
                                            type="text"
                                            name="color"
                                            value={formData.color}
                                            onChange={handleInputChange}
                                            placeholder="Black, White, Blue..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Цена *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                            required
                                            placeholder="999.99"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Статус</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Available">В наличии</option>
                                            <option value="OutOfStock">Нет в наличии</option>
                                            <option value="ComingSoon">Скоро в продаже</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Память</label>
                                        <input
                                            type="text"
                                            name="storage"
                                            value={formData.storage}
                                            onChange={handleInputChange}
                                            placeholder="128GB, 256GB, 512GB..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Процессор</label>
                                        <input
                                            type="text"
                                            name="processor"
                                            value={formData.processor}
                                            onChange={handleInputChange}
                                            placeholder="A17 Pro, Snapdragon 8 Gen 2..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Размер экрана</label>
                                        <input
                                            type="text"
                                            name="size"
                                            value={formData.size}
                                            onChange={handleInputChange}
                                            placeholder="6.1 inches, 6.7 inches..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Вес (г)</label>
                                        <input
                                            type="number"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleInputChange}
                                            step="0.1"
                                            min="0"
                                            placeholder="187"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Дисплей</label>
                                        <input
                                            type="text"
                                            name="display"
                                            value={formData.display}
                                            onChange={handleInputChange}
                                            placeholder="OLED, Super Retina XDR..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Камера</label>
                                        <input
                                            type="text"
                                            name="camera"
                                            value={formData.camera}
                                            onChange={handleInputChange}
                                            placeholder="48MP Main, 12MP Ultra Wide..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Подключение</label>
                                        <input
                                            type="text"
                                            name="connection"
                                            value={formData.connection}
                                            onChange={handleInputChange}
                                            placeholder="5G, Wi-Fi 6, Bluetooth 5.3..."
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Описание</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="4"
                                            placeholder="Подробное описание телефона..."
                                        />
                                    </div>
                                </div>

                                <div className="image-upload">
                                    <h4>Изображения</h4>
                                    <div className="image-upload-grid">
                                        <div className="form-group">
                                            <label>Основное изображение</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, 'file1')}
                                            />
                                            <small>Рекомендуется: 600x600 px</small>
                                        </div>
                                        <div className="form-group">
                                            <label>Дополнительное изображение</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, 'file2')}
                                            />
                                            <small>Опционально</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" onClick={resetForm} className="btn btn-secondary">
                                        Отмена
                                    </button>
                                    <button type="submit" disabled={loading} className="btn btn-primary">
                                        {loading ? 'Сохранение...' : (editingTelephone ? 'Обновить телефон' : 'Добавить телефон')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="telephones-table-container">
                {loading ? (
                    <div className="loading">Загрузка...</div>
                ) : (
                    <table className="telephones-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Изображение</th>
                            <th>Модель</th>
                            <th>Бренд</th>
                            <th>Цена</th>
                            <th>Статус</th>
                            <th>Память</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredTelephones.map(telephone => (
                            <tr key={telephone.id}>
                                <td>{telephone.id}</td>
                                <td>
                                    {telephone.images && telephone.images.length > 0 ? (
                                        <img
                                            src={`data:image/jpeg;base64,${telephone.images[0].imageBytes}`}
                                            alt={telephone.model}
                                            className="table-image"
                                        />
                                    ) : (
                                        <div className="no-image">Нет фото</div>
                                    )}
                                </td>
                                <td>
                                    <div className="model-info">
                                        <strong>{telephone.model}</strong>
                                        {telephone.color && <span className="color-badge">{telephone.color}</span>}
                                    </div>
                                </td>
                                <td>{telephone.brand}</td>
                                <td>${telephone.price}</td>
                                <td>
                                    <span className={`status ${telephone.status?.toLowerCase()}`}>
                                        {telephone.status === 'Available' && 'В наличии'}
                                        {telephone.status === 'OutOfStock' && 'Нет в наличии'}
                                        {telephone.status === 'ComingSoon' && 'Скоро в продаже'}
                                    </span>
                                </td>
                                <td>{telephone.storage || '-'}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => handleEdit(telephone)}
                                            className="btn btn-edit"
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            onClick={() => handleDelete(telephone.id)}
                                            className="btn btn-delete"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                {filteredTelephones.length === 0 && !loading && (
                    <div className="no-data">
                        {searchTerm ? 'Телефоны по вашему запросу не найдены' : 'Телефоны не найдены'}
                    </div>
                )}
            </div>
        </div>
    );
};

// Компонент для управления заказами
const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/orders/all`);
            if (!response.ok) {
                throw new Error('Ошибка загрузки заказов');
            }
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
            alert('Ошибка загрузки заказов');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${API_BASE}/orders/update-status/${orderId}?status=${newStatus}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка обновления статуса');
            }

            const updatedOrder = await response.json();

            setOrders(prev => prev.map(order =>
                order.id === orderId ? updatedOrder : order
            ));

            alert('Статус заказа обновлен!');
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Ошибка обновления статуса заказа');
        }
    };

    const deleteOrder = async (orderId) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/orders/delete/${orderId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Ошибка удаления заказа');
            }

            setOrders(prev => prev.filter(order => order.id !== orderId));
            alert('Заказ удален!');
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Ошибка удаления заказа');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#ffc107';
            case 'Processing': return '#17a2b8';
            case 'Shipped': return '#007bff';
            case 'Delivered': return '#28a745';
            case 'Cancelled': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Pending': return 'Ожидание';
            case 'Processing': return 'В обработке';
            case 'Shipped': return 'Отправлен';
            case 'Delivered': return 'Доставлен';
            case 'Cancelled': return 'Отменен';
            default: return status;
        }
    };

    const filteredOrders = statusFilter
        ? orders.filter(order => order.status === statusFilter)
        : orders;

    return (
        <div className="order-management">
            <div className="management-header">
                <h2>Управление заказами</h2>
                <div className="management-controls">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="status-filter"
                    >
                        <option value="">Все статусы</option>
                        <option value="Pending">Ожидание</option>
                        <option value="Processing">В обработке</option>
                        <option value="Shipped">Отправлен</option>
                        <option value="Delivered">Доставлен</option>
                        <option value="Cancelled">Отменен</option>
                    </select>
                    <button onClick={loadOrders} className="btn btn-secondary">
                        Обновить
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">Загрузка заказов...</div>
            ) : (
                <div className="orders-grid">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-card-header">
                                <h3>Заказ #{order.id}</h3>
                                <span
                                    className="order-status"
                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                >
                                    {getStatusText(order.status)}
                                </span>
                            </div>

                            <div className="order-info">
                                <p><strong>Клиент:</strong> {order.fullName}</p>
                                <p><strong>Телефон:</strong> {order.phoneNumber}</p>
                                <p><strong>Адрес:</strong> {order.address}</p>
                                <p><strong>Дата заказа:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                            </div>

                            <div className="order-items">
                                <h4>Товары:</h4>
                                {order.telephones && order.telephones.map(phone => (
                                    <div key={phone.id} className="order-item">
                                        <div className="item-info">
                                            <span className="item-name">{phone.brand} {phone.model}</span>
                                            {phone.color && <span className="item-color">{phone.color}</span>}
                                        </div>
                                        <span className="item-price">${phone.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-total">
                                <strong>
                                    Итого: ${order.telephones?.reduce((sum, phone) => sum + (phone.price || 0), 0).toFixed(2)}
                                </strong>
                            </div>

                            <div className="order-actions">
                                <select
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                    className="status-select"
                                >
                                    <option value="Pending">Ожидание</option>
                                    <option value="Processing">В обработке</option>
                                    <option value="Shipped">Отправлен</option>
                                    <option value="Delivered">Доставлен</option>
                                    <option value="Cancelled">Отменен</option>
                                </select>

                                <button
                                    onClick={() => deleteOrder(order.id)}
                                    className="btn btn-delete"
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredOrders.length === 0 && !loading && (
                <div className="no-data">
                    <p>Заказы не найдены</p>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
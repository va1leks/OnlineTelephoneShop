// src/pages/TelephoneDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTelephoneById, addTelephoneToCart } from '../services/api';
import './TelephoneDetails.css'; // Создадим этот файл стилей позже

const CLIENT_ID = 1; // Заглушка

const TelephoneDetails = () => {
    const { id } = useParams();
    const [telephone, setTelephone] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImageUrl, setMainImageUrl] = useState('');

    useEffect(() => {
        const getTelephoneDetails = async () => {
            try {
                const data = await fetchTelephoneById(id);
                setTelephone(data);
                if (data.images && data.images.length > 0) {
                    setMainImageUrl(data.images.find(img => img.previewImage)?.url || data.images[0].url);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getTelephoneDetails();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            await addTelephoneToCart(CLIENT_ID, telephone.id);
            alert('Телефон добавлен в корзину!');
        } catch (err) {
            alert(`Ошибка при добавлении в корзину: ${err.message}`);
        }
    };

    if (loading) return <div className="loading-message">Загрузка деталей телефона...</div>;
    if (error) return <div className="error-message">Ошибка: {error}</div>;
    if (!telephone) return <div className="error-message">Телефон не найден.</div>;

    return (
        <div className="telephone-details-page">
            <div className="details-container">
                <div className="image-gallery">
                    <img src={mainImageUrl} alt={telephone.model} className="main-image" />
                    <div className="thumbnail-images">
                        {telephone.images.map((img, index) => (
                            <img
                                key={index}
                                src={img.url}
                                alt={`Thumbnail ${index}`}
                                className={`thumbnail ${img.url === mainImageUrl ? 'active' : ''}`}
                                onClick={() => setMainImageUrl(img.url)}
                            />
                        ))}
                    </div>
                </div>

                <div className="info-section">
                    <h1>{telephone.brand} {telephone.model}</h1>
                    <p className="price">{telephone.price} ₽</p>
                    <p className="description">{telephone.description}</p>

                    <div className="specs-grid">
                        <div className="spec-item"><strong>Цвет:</strong> <span>{telephone.color}</span></div>
                        <div className="spec-item"><strong>Память:</strong> <span>{telephone.storage}</span></div>
                        <div className="spec-item"><strong>Процессор:</strong> <span>{telephone.processor}</span></div>
                        <div className="spec-item"><strong>Дисплей:</strong> <span>{telephone.display}</span></div>
                        <div className="spec-item"><strong>Камера:</strong> <span>{telephone.camera}</span></div>
                        <div className="spec-item"><strong>Подключение:</strong> <span>{telephone.connection}</span></div>
                        <div className="spec-item"><strong>Размер:</strong> <span>{telephone.size}</span></div>
                        <div className="spec-item"><strong>Вес:</strong> <span>{telephone.weight} г</span></div>
                        <div className="spec-item"><strong>Статус:</strong> <span>{telephone.status}</span></div>
                    </div>

                    <button className="add-to-cart-button" onClick={handleAddToCart}>
                        Добавить в корзину
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TelephoneDetails;
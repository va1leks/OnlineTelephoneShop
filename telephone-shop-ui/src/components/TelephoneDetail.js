import React, { useState } from 'react';

const TelephoneDetail = ({ telephone, onAddToCart, onBuyNow, onBack }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const allImages = telephone.images || [];
    const mainImage = allImages[currentImageIndex];

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === allImages.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? allImages.length - 1 : prev - 1
        );
    };

    const handleAddToCart = () => {
        if (telephone.status === 'Available') {
            onAddToCart(telephone.id);
        }
    };

    const handleBuyNow = () => {
        if (telephone.status === 'Available') {
            onBuyNow(telephone.id);
        }
    };

    return (
        <div className="telephone-detail">
            <div className="container">
                <button className="back-btn" onClick={onBack}>
                    ← Назад к каталогу
                </button>

                <div className="detail-content">
                    <div className="image-gallery">
                        {allImages.length > 0 ? (
                            <>
                                <div className="main-image">
                                    <img
                                        src={`http://localhost:8080${mainImage?.url}`}
                                        alt={`${telephone.brand} ${telephone.model}`}
                                        className="detail-product-image"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/600x600/667eea/ffffff?text=No+Image';
                                        }}
                                    />
                                    {allImages.length > 1 && (
                                        <>
                                            <button className="nav-btn prev-btn" onClick={prevImage}>
                                                ‹
                                            </button>
                                            <button className="nav-btn next-btn" onClick={nextImage}>
                                                ›
                                            </button>
                                        </>
                                    )}
                                </div>

                                {allImages.length > 1 && (
                                    <div className="image-thumbnails">
                                        {allImages.map((image, index) => (
                                            <img
                                                key={image.id}
                                                src={`http://localhost:8080${image.url}`}
                                                alt={`${telephone.brand} ${telephone.model} ${index + 1}`}
                                                className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                                onClick={() => setCurrentImageIndex(index)}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/80x80/667eea/ffffff?text=Img';
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="no-image-large">
                                <div>Изображение отсутствует</div>
                            </div>
                        )}
                    </div>

                    <div className="detail-info">
                        <h1 className="detail-title">{telephone.brand} {telephone.model}</h1>

                        <div className="price-section">
              <span className="detail-price">
                {telephone.price ? `$${telephone.price}` : 'Цена не указана'}
              </span>
                            <span className={`status-badge ${telephone.status?.toLowerCase().replace(' ', '-') || 'unknown'}`}>
                {telephone.status || 'Неизвестно'}
              </span>
                        </div>

                        <div className="specs-section">
                            <h3>Характеристики</h3>
                            <div className="specs-grid">
                                <div className="spec-item">
                                    <span className="spec-label">Бренд:</span>
                                    <span className="spec-value">{telephone.brand || 'Не указан'}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Модель:</span>
                                    <span className="spec-value">{telephone.model || 'Не указана'}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Цвет:</span>
                                    <span className="spec-value">{telephone.color || 'Не указан'}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Память:</span>
                                    <span className="spec-value">{telephone.storage || 'Не указана'}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Процессор:</span>
                                    <span className="spec-value">{telephone.processor || 'Не указан'}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Дисплей:</span>
                                    <span className="spec-value">{telephone.display || 'Не указан'}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Камера:</span>
                                    <span className="spec-value">{telephone.camera || 'Не указана'}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Размер экрана:</span>
                                    <span className="spec-value">{telephone.size ? `${telephone.size}"` : 'Не указан'}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Вес:</span>
                                    <span className="spec-value">{telephone.weight ? `${telephone.weight}г` : 'Не указан'}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Подключение:</span>
                                    <span className="spec-value">{telephone.connection || 'Не указано'}</span>
                                </div>
                            </div>
                        </div>

                        {telephone.description && (
                            <div className="description-section">
                                <h3>Описание</h3>
                                <p className="detail-description">{telephone.description}</p>
                            </div>
                        )}

                        <div className="action-buttons">
                            {/*<button*/}
                            {/*    className={`add-to-cart-btn large ${telephone.status !== 'Available' ? 'disabled' : ''}`}*/}
                            {/*    onClick={handleAddToCart}*/}
                            {/*    disabled={telephone.status !== 'Available'}*/}
                            {/*>*/}
                            {/*    {telephone.status === 'Available' ? 'Добавить в корзину' : 'Нет в наличии'}*/}
                            {/*</button>*/}

                            {/*<button*/}
                            {/*    className={`buy-now-btn ${telephone.status !== 'Available' ? 'disabled' : ''}`}*/}
                            {/*    onClick={handleBuyNow}*/}
                            {/*    disabled={telephone.status !== 'Available'}*/}
                            {/*>*/}
                            {/*    Купить сейчас*/}
                            {/*</button>*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TelephoneDetail;
import React, { useState, useRef, useEffect } from 'react';

const TelephoneCard = ({ telephone, onAddToCart, onTelephoneClick }) => {
    const previewImage = telephone.images?.find(img => img.previewImage) || telephone.images?.[0];
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSizeClass, setImageSizeClass] = useState('');
    const imgRef = useRef(null);

    const handleImageLoad = () => {
        setImageLoaded(true);
        if (imgRef.current) {
            const { naturalWidth, naturalHeight } = imgRef.current;
            const aspectRatio = naturalWidth / naturalHeight;

            // Определяем класс на основе соотношения сторон и размера
            if (aspectRatio > 1.2) {
                setImageSizeClass('image-wide');
            } else if (aspectRatio < 0.8) {
                setImageSizeClass('image-tall');
            } else if (naturalWidth < 200 || naturalHeight < 200) {
                setImageSizeClass('image-small');
            } else {
                setImageSizeClass('image-normal');
            }
        }
    };

    const handleAddToCartClick = (e) => {
        e.stopPropagation();
        if (telephone.status === 'Available') {
            onAddToCart(telephone.id);
        } else {
            alert('Этот телефон недоступен для добавления в корзину');
        }
    };

    const handleCardClick = () => {
        onTelephoneClick(telephone.id);
    };

    return (
        <div className="telephone-card" onClick={handleCardClick}>
            <div className="card-image-container">
                <div className="card-image">
                    {previewImage ? (
                        <img
                            ref={imgRef}
                            src={`http://localhost:8080${previewImage.url}`}
                            alt={telephone.model}
                            className={`product-image ${imageSizeClass} ${imageLoaded ? 'loaded' : 'loading'}`}
                            onLoad={handleImageLoad}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/250x300/667eea/ffffff?text=No+Image';
                                setImageLoaded(true);
                            }}
                            style={{ opacity: imageLoaded ? 1 : 0 }}
                        />
                    ) : (
                        <div className="no-image">Нет изображения</div>
                    )}
                    {!imageLoaded && previewImage && (
                        <div className="image-loading">Загрузка...</div>
                    )}
                </div>
                <div className={`card-status ${telephone.status?.toLowerCase().replace(' ', '-') || 'unknown'}`}>
                    {telephone.status || 'Неизвестно'}
                </div>
            </div>

            <div className="card-content">
                <h3 className="card-title">{telephone.brand} {telephone.model}</h3>
                <p className="card-price">{telephone.price ? `$${telephone.price}` : 'Цена не указана'}</p>
                <p className="card-color">Цвет: {telephone.color || 'Не указан'}</p>
                <p className="card-storage">Память: {telephone.storage || 'Не указана'}</p>

                <div className="card-actions">
                    <button
                        className={`add-to-cart-btn ${telephone.status !== 'Available' ? 'disabled' : ''}`}
                        onClick={handleAddToCartClick}
                        disabled={telephone.status !== 'Available'}
                    >
                        {telephone.status === 'Available' ? 'В корзину' : 'Нет в наличии'}
                    </button>

                    <button
                        className="details-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onTelephoneClick(telephone.id);
                        }}
                    >
                        Подробнее
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TelephoneCard;
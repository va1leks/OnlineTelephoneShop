import React from 'react';

const Header = ({ cartCount, onCartClick, onLogoClick }) => {
    return (
        <header className="header">
            <div className="container">
                <h1 className="logo" onClick={onLogoClick} style={{cursor: 'pointer'}}>
                    📱 PhoneShop
                </h1>
                <nav className="nav">
                    <button className="cart-btn" onClick={onCartClick}>
                        🛒 Корзина {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
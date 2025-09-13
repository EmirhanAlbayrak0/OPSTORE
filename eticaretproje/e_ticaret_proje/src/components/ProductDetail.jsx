import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../css/ProductDetails.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../redux/slice/productSlice';

function ProductDetail({ addToCart }) {
    const { id } = useParams();
    const { products, loading } = useSelector(state => state.product);
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);

    const product = products?.find((product) => String(product.id) === String(id));
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    if (loading) return <p>Yükleniyor...</p>;
    if (!products.length) return <p>Ürün bulunamadı</p>;


    const { price, images, title, description, stock } = product;

    const increase = () => { if (quantity < stock) setQuantity(quantity + 1); };
    const decrease = () => { if (quantity > 1) setQuantity(quantity - 1); };

    return (
        <div className="product-detail">
            <img className="product-detail-image" src={images} alt={title} />

            <div className="product-detail-info">
                <h2 className="product-detail-title">{title}</h2>
                <p className="product-detail-desc">{description}</p>
                <span className="product-detail-price">{price} TRY</span>

                <div className="product-detail-counter">
                    <button className="counter-btn" onClick={decrease}>-</button>
                    <span className="counter-value">{quantity}</span>
                    <button className="counter-btn" onClick={increase}>+</button>
                    <span className="stock-info">(Stok: {stock})</span>
                </div>

                <button className="product-detail-buy-btn" onClick={() => addToCart(product, quantity, navigate, toast)}>
                    Sepete Ekle ({quantity})
                </button>
            </div>
        </div>
    );
}

export default ProductDetail; 

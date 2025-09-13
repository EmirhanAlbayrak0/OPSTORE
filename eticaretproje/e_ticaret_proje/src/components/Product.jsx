import React from 'react'
import '../css/Product.css'
import { useNavigate } from 'react-router-dom';

function Product({ product }) {
    const { id, price, images, title, description, stock } = product;
    const navigate = useNavigate();
    return (
        <div className='product-card' onClick={() => navigate("/product/" + id)}>
            <img src={images} alt={title} />
            <h2>{title}</h2>
            <p>{description}</p>
            <span>{price} TRY</span>
        </div>
    )
}

export default Product

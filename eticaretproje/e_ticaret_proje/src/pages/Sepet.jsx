import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, clearCart, fetchCartFromFirestore } from '../redux/slice/cartSlice';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../Firebase';
import '../css/Sepet.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Sepet() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser(u);
                dispatch(fetchCartFromFirestore());
            } else {
                setUser(null);
                dispatch(clearCart());
            }
        });
        return () => unsubscribe();
    }, [dispatch]);

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handleConfirmCart = () => {
        if (!user) {
            toast.error("Önce giriş yapmalısınız!");
            return;
        }
        if (cartItems.length === 0) {
            toast.error("Sepetiniz boş!");
            return;
        }
        navigate("/purchase");
    };

    return (
        <div className="sepet-container">
            <h2>Sepet</h2>
            <ul>
                {cartItems.map((item) => (
                    <li key={item.id} className="sepet-item">
                        <img src={item.images} alt={item.title} width={50} />
                        <span>{item.title} - {item.quantity} x {item.price} TRY</span>
                        <button onClick={() => dispatch(removeFromCart(item.id))}>
                            Kaldır
                        </button>
                    </li>
                ))}
            </ul>
            <h3>Toplam: {totalPrice.toFixed(2)} TRY</h3>
            <button className="purchase-button" onClick={handleConfirmCart}>
                Sepeti Onayla
            </button>
        </div>
    );
}

export default Sepet;

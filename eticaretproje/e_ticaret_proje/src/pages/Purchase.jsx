import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, db } from '../Firebase';
import { doc, setDoc, collection, deleteDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { clearCart, fetchCartFromFirestore } from '../redux/slice/cartSlice';
import '../css/Purchase.css';

function Purchase() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        tckn: "",
        address: ""
    });
    const [tcknError, setTcknError] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(u => {
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

    const totalPrice = cartItems.reduce((total, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        return total + price * quantity;
    }, 0);

    const updateStockForOrder = async () => {
        try {
            for (const item of cartItems) {
                const q = query(collection(db, "prductss"), where("id", "==", Number(item.id)));
                const querySnap = await getDocs(q);
                if (querySnap.empty) continue;

                querySnap.forEach(async (docSnap) => {
                    const currentStock = Number(docSnap.data().stock) || 0;
                    const newStock = Math.max(currentStock - Number(item.quantity), 0);
                    await updateDoc(docSnap.ref, { stock: newStock });
                });
            }
        } catch (err) {
            console.error(err);
            toast.error("Stock güncellenirken hata oluştu!");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "tckn") {
            if (!/^\d*$/.test(value)) return;
            if (value.length === 11) {
                const lastDigit = parseInt(value[10], 10);
                setTcknError(lastDigit % 2 === 0 ? "" : "Lütfen geçerli bir TCKN giriniz");
            } else if (value.length > 0 && value.length < 11) {
                setTcknError("Lütfen geçerli bir TCKN giriniz");
            } else {
                setTcknError("");
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Önce giriş yapmalısınız!");
            return;
        }
        if (!cartItems || cartItems.length === 0) {
            toast.error("Sepetiniz boş!");
            return;
        }
        if (formData.tckn.length !== 11 || tcknError) {
            toast.error(" Lütfen geçerli bir TCKN giriniz!");
            return;
        }

        try {
            const productsForOrder = cartItems.map(item => ({
                id: item.id,
                quantity: Number(item.quantity) || 0
            }));

            const siparisId = Math.random().toString(36).substring(2, 10);
            const orderRef = doc(collection(db, "orders", user.uid, "userOrders"), siparisId);

            await setDoc(orderRef, {
                siparisId,
                userEmail: user.email,
                userId: user.uid,
                ...formData,
                products: productsForOrder,
                totalPrice,
                createdAt: new Date().toISOString(),
            });

            await updateStockForOrder();

            const cartRef = doc(db, "carts", user.uid);
            await deleteDoc(cartRef);
            dispatch(clearCart());

            toast.success("Sipariş onaylandı!");
            navigate("/");
        } catch (err) {
            console.error(err);
            toast.error("Sipariş kaydedilirken hata oluştu!");
        }
    };

    return (
        <div className="purchase-container">
            <h2 className="purchase-title">Sipariş Bilgileri</h2>
            <form className="purchase-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>İsim</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Soyisim</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Telefon Numarası</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="05xx xxx xx xx" required />
                </div>

                <div className="form-group">
                    <label>T.C. Kimlik Numarası</label>
                    <input type="text" name="tckn" value={formData.tckn} onChange={handleChange} maxLength="11" required />
                    {tcknError && <small style={{ color: "red" }}>{tcknError}</small>}
                </div>

                <div className="form-group">
                    <label>Adres</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} required />
                </div>

                <h3 className="total-price">Toplam: {totalPrice.toFixed(2)} TRY</h3>

                <button type="submit" className="purchase-button">Siparişi Tamamla</button>
            </form>
        </div>
    );
}

export default Purchase;

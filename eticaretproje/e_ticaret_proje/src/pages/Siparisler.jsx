import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";
import "../css/Siparisler.css";

function Siparisler() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setOrders([]);
                setLoading(false);
                return;
            }

            try {
                const ordersRef = collection(db, "orders", user.uid, "userOrders");
                const snapshot = await getDocs(ordersRef);

                let fetchedOrders = [];
                for (const docSnap of snapshot.docs) {
                    const orderData = docSnap.data();

                    const orderProducts = [];

                    for (const p of orderData.products) {
                        const q = query(collection(db, "prductss"), where("id", "==", p.id));
                        const productSnap = await getDocs(q);

                        if (!productSnap.empty) {
                            const productData = productSnap.docs[0].data();

                            orderProducts.push({
                                ...productData,
                                quantity: p.quantity,
                            });
                        } else {
                            console.warn("Ürün prductss koleksiyonunda bulunamadı:", p.id);
                        }
                    }

                    fetchedOrders.push({
                        id: docSnap.id,
                        ...orderData,
                        products: orderProducts,
                    });
                }


                fetchedOrders.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setOrders(fetchedOrders);
            } catch (err) {
                console.error("Siparişler alınırken hata:", err);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <p>Siparişler yükleniyor...</p>;
    if (!orders.length) return <p>Henüz hiç siparişiniz yok.</p>;

    return (
        <div className="siparisler-container">
            <h2>Siparişlerim</h2>
            {orders.map((order) => (
                <div key={order.id} className="siparis-card">
                    <h3>Sipariş ID: {order.siparisId}</h3>
                    <p><strong>Tarih:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                    <p><strong>Adres:</strong> {order.address}</p>

                    <div className="siparis-urunler">
                        <h4>Ürünler:</h4>
                        {order.products.map((p, idx) => (
                            <div key={idx} className="siparis-urun">
                                <img src={p.images} alt={p.title} width="80" />
                                <div>
                                    <p><strong>{p.title}</strong></p>
                                    <p>ID: {p.id}</p>
                                    <p>Adet: {p.quantity}</p>
                                    <p>Birim Fiyat: {p.price} ₺</p>
                                    <p>Toplam: {p.price * p.quantity} ₺</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h4 className="siparis-total">Toplam Tutar: {order.totalPrice} ₺</h4>
                </div>
            ))}
        </div>
    );
}

export default Siparisler;

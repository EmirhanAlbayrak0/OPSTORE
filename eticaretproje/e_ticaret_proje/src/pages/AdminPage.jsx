import React, { useState, useEffect } from "react";
import { db, auth } from "../Firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import "../css/AdminPage.css";

function AdminPage() {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        description: "",
        price: "",
        stock: "",
        images: "",
    });
    const [editingDocId, setEditingDocId] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u || null);
        });
        return () => unsub();
    }, []);

    const fetchProducts = async () => {
        try {
            const snap = await getDocs(collection(db, "prductss"));
            setProducts(snap.docs.map((d) => ({ docId: d.id, ...d.data() })));
        } catch (err) {
            console.error(err);
            toast.error("Ürünler yüklenemedi");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleAddProduct = async (e) => {
        e?.preventDefault?.();
        try {
            await addDoc(collection(db, "prductss"), {
                ...formData,
                id: formData.id ? Number(formData.id) : undefined,
                price: Number(formData.price) || 0,
                stock: Number(formData.stock) || 0,
                images: formData.images || "",
            });
            toast.success("Ürün eklendi");
            setFormData({ id: "", title: "", description: "", price: "", stock: "", images: "" });
            fetchProducts();
        } catch (err) {
            console.error("Ürün eklenemedi:", err);
            toast.error("Ürün eklenemedi: " + (err.message || err));
        }
    };

    const handleEditClick = (p) => {
        setEditingDocId(p.docId);
        setFormData({
            id: p.id ?? "",
            title: p.title ?? "",
            description: p.description ?? "",
            price: p.price ?? "",
            stock: p.stock ?? "",
            images: p.images ?? "",
        });
    };

    const handleUpdateProduct = async () => {
        if (!editingDocId) {
            toast.error("Güncellenecek ürün seçilmedi");
            return;
        }
        try {
            const ref = doc(db, "prductss", editingDocId);
            await updateDoc(ref, {
                ...formData,
                id: formData.id ? Number(formData.id) : undefined,
                price: Number(formData.price) || 0,
                stock: Number(formData.stock) || 0,
                images: formData.images || "",
            });
            toast.success("Ürün güncellendi");
            setEditingDocId(null);
            setFormData({ id: "", title: "", description: "", price: "", stock: "", images: "" });
            fetchProducts();
        } catch (err) {
            console.error("Ürün güncellenemedi:", err);
            toast.error("Güncellenemedi: " + (err.message || err));
        }
    };

    const handleDeleteProduct = async (docId) => {
        if (!docId) {
            toast.error("Silinecek ürünün docId'si bulunamadı");
            return;
        }
        if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
        try {
            await deleteDoc(doc(db, "prductss", docId));
            toast.success("Ürün silindi");
            fetchProducts();
        } catch (err) {
            console.error("Ürün silinemedi:", err);
            toast.error("Silinemedi: " + (err.message || err));
        }
    };

    const admins = ["emirhanrz53gs@gmail.com", "emirhanrz53gs2@gmail.com"];

    if (!user || !admins.includes(user.email)) {
        return <h2>Bu sayfaya erişim izniniz yok.</h2>;
    }


    return (
        <div className="admin-container">
            <h2>Admin Panel</h2>

            <form className="admin-form" onSubmit={handleAddProduct}>

                <input
                    name="id"
                    type="number"
                    value={formData.id}
                    onChange={handleChange}
                    placeholder="Ürün iç id (opsiyonel)"
                />
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ürün Başlığı"
                    required
                />
                <input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Açıklama"
                />
                <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Fiyat"
                />
                <input
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Stok"
                />
                <input
                    name="images"
                    value={formData.images}
                    onChange={handleChange}
                    placeholder="Resim URL"
                />

                {editingDocId ? (
                    <div style={{ display: "flex", gap: 8 }}>
                        <button type="button" onClick={handleUpdateProduct}>
                            Güncelle
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setEditingDocId(null);
                                setFormData({ id: "", title: "", description: "", price: "", stock: "", images: "" });
                            }}
                        >
                            İptal
                        </button>
                    </div>
                ) : (
                    <button type="submit">Ürün Ekle</button>
                )}
            </form>

            <div className="admin-product-list">
                <h3>Eklenen Ürünler</h3>
                <div className="product-container">
                    {products.map((p) => (
                        <div key={p.docId} className="product-card">
                            <img src={p.images} alt={p.title} />
                            <h2>{p.title}</h2>
                            <p>{p.description}</p>
                            <span>{p.price}₺</span>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <button className="edit-btn" onClick={() => handleEditClick(p)}>
                                    Düzenle
                                </button>
                                <button className="delete-btn" onClick={() => handleDeleteProduct(p.docId)}>
                                    Ürünü Kaldır
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default AdminPage;

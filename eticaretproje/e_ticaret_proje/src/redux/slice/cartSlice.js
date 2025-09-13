import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, auth } from "../../Firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Firestore'dan cart'ı çek
export const fetchCartFromFirestore = createAsyncThunk(
    "cart/fetchCartFromFirestore",
    async (_, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) return { cartItems: [], totalPrice: 0 };
            const ref = doc(db, "carts", user.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                return {
                    cartItems: snap.data().cartItems || [],
                    totalPrice: snap.data().totalPrice || 0,
                };
            } else {
                return { cartItems: [], totalPrice: 0 };
            }
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Firestore'a cart'ı kaydet
export const saveCartToFirestore = createAsyncThunk(
    "cart/saveCartToFirestore",
    async (cartItems, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            // toplam fiyatı hesapla
            const totalPrice = cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            const ref = doc(db, "carts", user.uid);
            await setDoc(ref, {
                cartItems,
                totalPrice,
                userEmail: user.email,
            });
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const initialState = {
    cartItems: [],
    totalPrice: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { product, quantity } = action.payload;
            const existing = state.cartItems.find((item) => item.id === product.id);

            if (existing) {
                existing.quantity += quantity;
            } else {
                state.cartItems.push({ ...product, quantity });
            }

            // totalPrice güncelle
            state.totalPrice = state.cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            // Firestore'a kaydet
            const user = auth.currentUser;
            if (user) {
                setDoc(doc(db, "carts", user.uid), {
                    cartItems: state.cartItems,
                    totalPrice: state.totalPrice,
                    userEmail: user.email,
                });
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (item) => item.id !== action.payload
            );

            state.totalPrice = state.cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            const user = auth.currentUser;
            if (user) {
                setDoc(doc(db, "carts", user.uid), {
                    cartItems: state.cartItems,
                    totalPrice: state.totalPrice,
                    userEmail: user.email,
                });
            }
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.totalPrice = 0;

            const user = auth.currentUser;
            if (user) {
                setDoc(doc(db, "carts", user.uid), {
                    cartItems: [],
                    totalPrice: 0,
                    userEmail: user.email,
                });
            }
        },
        setCart: (state, action) => {
            state.cartItems = action.payload.cartItems;
            state.totalPrice = action.payload.totalPrice;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCartFromFirestore.fulfilled, (state, action) => {
            state.cartItems = action.payload.cartItems;
            state.totalPrice = action.payload.totalPrice;
        });
    },
});

export const { addToCart, removeFromCart, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;

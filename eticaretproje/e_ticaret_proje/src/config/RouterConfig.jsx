import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProductList from '../components/ProductList'
import ProductDetail from '../components/ProductDetail'
import Profile from '../pages/Profile'
import Auth from '../pages/Auth'
import Sepet from '../pages/Sepet'
import Siparisler from '../pages/Siparisler'
import Purchase from '../pages/Purchase'
import AdminPage from '../pages/AdminPage'

function RouterConfig({ cartItems, addToCart, removeFromCart }) {
    return (
        <Routes>
            <Route path='/' element={<ProductList />} />
            <Route path='/product/:id' element={<ProductDetail addToCart={addToCart} />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/sepet' element={<Sepet cartItems={cartItems} removeFromCart={removeFromCart} />} />
            <Route path='/purchase' element={<Purchase />} />
            <Route path='/siparisler' element={<Siparisler />} />
            <Route path="/admin" element={<AdminPage />} />

        </Routes>
    );
}


export default RouterConfig
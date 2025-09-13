import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from 'react-toastify';
import { auth } from '../Firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import '../css/Auth.css'

function Auth() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();

    const login = async () => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            const user = response.user;
            if (user) {
                navigate('/');
                toast.success("Giriş başarılı");

            }
        } catch (error) {
            toast.error("Giriş başarısız: " + error.message);
        }
    }

    const register = async () => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const user = response.user;
            if (user) {
                toast.success("Kayıt başarılı");
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            toast.error("Kayıt başarısız: " + error.message);
        }
    }



    return (
        <div className='auth-container'>
            <h3 className='auth-header'>Giriş Yap/Kayıt Ol</h3>
            <div>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder='email adres' />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='şifre' />
            </div>
            <div>
                <button className='google-button'>Google ile giriş</button>
                <button onClick={login} className='login-button'>giriş yap</button>
                <button onClick={register} className='register-button'>kayıt ol</button>
            </div>
        </div>
    )
}


export default Auth
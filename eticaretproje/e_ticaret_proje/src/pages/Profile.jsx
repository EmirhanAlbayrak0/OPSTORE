import React, { useEffect, useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom'
import { auth } from '../Firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import '../css/Profil.css'
import logo from '../images/logo5.png';



function Profile() {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
            } else {
                setUserEmail(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            toast.success("Çıkış başarılı");
            navigate('/');
        } catch (error) {
            toast.error("Çıkış başarısız: " + error.message);
        }
    }

    return (


        <div className='profil'>
            <h1>Hoşgeldin {userEmail ? userEmail : '...'}</h1>
            <img className='profil-logo'
                src={logo} alt="Logo" />
            <div className='profil-buttons'>
                <button onClick={() => navigate("/auth")}>Giriş Yap/Kayı Ol</button>
                <button onClick={logout}>Çıkış Yap</button>
            </div>
        </div>

    )
}

export default Profile
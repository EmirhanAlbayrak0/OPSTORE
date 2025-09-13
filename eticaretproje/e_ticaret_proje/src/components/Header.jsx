import React, { useEffect, useState } from 'react';
import logo from '../images/logo5.png';
import '../css/Header.css';
import { BsBasket } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { AiFillProduct } from "react-icons/ai";
import { MdAdminPanelSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";

function Header() {
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

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
      <div className='flex-row'>
        <img
          className='logo'
          src={logo}
          alt="Logo"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
        <p className='logoText'>OPSTORE.COM</p>
      </div>

      <div className='flex-row'>
        <div style={{ display: 'flex', gap: '24px' }}>
          {userEmail && (
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <AiFillProduct className='icons' onClick={() => navigate("/siparisler")} />
                <label style={{ fontSize: '14px', marginTop: '4px' }}>Siparişler</label>
              </div>

              {userEmail === "emirhanrz53gs@gmail.com" && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <MdAdminPanelSettings
                    className='icons'
                    onClick={() => navigate("/admin")}
                    style={{ cursor: "pointer" }}
                  />
                  <label style={{ fontSize: '14px', marginTop: '4px' }}>Admin Panel</label>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CgProfile className='icons' onClick={() => navigate("/profile")} />
            <label style={{ fontSize: '14px', marginTop: '4px' }}>Profil</label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <BsBasket
              className='icons'
              onClick={() => navigate("/sepet")}
              style={{ cursor: "pointer" }}
            />
            <label style={{ fontSize: '14px', marginTop: '4px' }}>Sepet</label>
          </div>
        </div>

        <input className='searchInput' type="text" placeholder='Ara:' />
      </div>
    </div>
  );
}

export default Header;

import { useEffect } from "react";
import './App.css';
import PageContainer from './container/PageContainer';
import Header from './components/Header';
import RouterConfig from './config/RouterConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "./redux/slice/cartSlice";

function App() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.cart);



  const handleAddToCart = (product, quantity, navigate) => {
    dispatch(addToCart({ product, quantity }));
    toast.success("Sepete eklendi!");
    navigate("/sepet");
  };

  return (
    <PageContainer>
      <Header />
      <RouterConfig
        cartItems={cartItems}
        addToCart={handleAddToCart}
      />
      <ToastContainer position="top-right" autoClose={2000} />
    </PageContainer>
  );
}

export default App;

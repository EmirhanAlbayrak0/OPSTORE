import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../redux/slice/productSlice";
import Product from "./Product";

function ProductList() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.product);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  if (loading) return <p>Yükleniyor...</p>;
  if (!products.length) return <p>Ürün bulunamadı</p>;

  return (
    <div className="product-container">
      {products.map(p => (
        <Product key={p.id} product={p} />
      ))}
    </div>
  );
}

export default ProductList;

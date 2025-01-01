import { configureStore } from '@reduxjs/toolkit';
import shopReducer from '../features/shop/shopSlice';
import FooterDataSlice from '../features/footer/footerSlice';
import signUpReducer from '../features/sign-up/signUpSlice';
import shopDetailReducer from '../features/shop-detail/shopDetailSlice'
import cartReducer from '../features/cart/cartSlice'
import wishlistReducer from '../features/wishlist/wishlistSlice'
import productDetailReducer from '../features/product-detail/productDetailSlice'
import signInReducer from '../features/sign-in/signInSlice'
import paymentReducer from '../features/payment/paymentSlice'
import signInSellerReducer from '../features/seller/signInSlice';
import userReducer from '../features/user/userSlice';
import registerSellerReducer from '../features/registerSeller/registerSellerSlice';
import cartCountReducer from '../features/cart/cartCountSlice';

const store = configureStore({
  reducer: {
    shop: shopReducer,
    footerdata: FooterDataSlice,
    signup: signUpReducer,
    shopDetail: shopDetailReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    productDetail: productDetailReducer,
    signIn: signInReducer,
    payment: paymentReducer,
    user: userReducer,
    registerSeller: registerSellerReducer,
    signInSeller: signInSellerReducer,
    cartCount: cartCountReducer,
  },
});

export default store;

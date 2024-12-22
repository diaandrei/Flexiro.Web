import { configureStore } from '@reduxjs/toolkit';
import shopReducer from '../features/shop/shopSlice';
import userReducer from '../features/user/userSlice';


const store = configureStore({
  reducer: {
    shop: shopReducer,
    user: userReducer,
  },
});

export default store;

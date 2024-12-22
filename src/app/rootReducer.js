import { combineReducers } from '@reduxjs/toolkit';
import shopReducer from '../features/shop/shopSlice';

const rootReducer = combineReducers({
  shop: shopReducer,
});

export default rootReducer;

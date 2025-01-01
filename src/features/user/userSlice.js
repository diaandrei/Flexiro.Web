import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userId: null, // Default state is null until the user logs in
    token: null,
    isAuthenticated: false,
    role: null,
    name: '',
    email: '',
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userId = action.payload.userId;
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.isAuthenticated = true;
            state.sellerId = action.payload.sellerId || null;
            state.shopId = action.payload.shopId || null;
            state.shopName = action.payload.shopName || null;
            state.ownerName = action.payload.ownerName || null;

            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logOutUser: (state) => {
            state.userId = null;
            state.token = null;
            state.isAuthenticated = false;
            state.role = null; // Clear role on logout
            state.name = ''; // Clear name on logout
            state.email = ''; // Clear email on logout
            localStorage.clear();
        },
    },
});

export const { setUser, logOutUser } = userSlice.actions;
export default userSlice.reducer;

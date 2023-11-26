import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking', // 'checking' | 'authenticated' | 'not-authenticated'
        user: {},
        errorMessage: undefined,
    },
    reducers: {
        onChecking: ( state ) => {
            state.status = 'checking';
            state.user = {};
            state.errorMessage = undefined;
        },
        onLogin: ( state ) => {
            state.status = 'authenticated';
            state.user = payload;
            state.errorMessage = undefined;
        }
    }
});

export const { increment } = authSlice.actions;

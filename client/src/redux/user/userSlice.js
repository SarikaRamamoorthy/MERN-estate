import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser : null,
    error : null,
    loading : false
}

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        signInStart : (state) => {
            state.loading = true;
        },
        signInSuccess : (state, action) => {
            state.loading = false;
            state.error = null;
            state.currentUser = action.payload;
        },
        signInFailure : (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart : (state, action) => {
            state.loading = true;
        },
        updateUserSuccess : (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure : (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
})

export const {signInStart, signInSuccess, signInFailure, updateUserStart, updateUserSuccess, updateUserFailure} = userSlice.actions;

export default userSlice.reducer;
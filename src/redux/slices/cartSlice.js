import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchCart,
    addToCart,
    updateCartItem,
    deleteCartItem,
} from "../../service/cartService";

// ✅ Async actions using createAsyncThunk

export const fetchCartAsync = createAsyncThunk("cart/fetchCart", async (_, thunkAPI) => {
    try {
        const res = await fetchCart();
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
});

export const addToCartAsync = createAsyncThunk("cart/addToCart", async (item, thunkAPI) => {
    try {
        const res = await addToCart(item);
        thunkAPI.dispatch(fetchCartAsync());
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
});

export const updateCartAsync = createAsyncThunk("cart/updateCart", async (item, thunkAPI) => {
    try {
        const res = await updateCartItem(item);
        thunkAPI.dispatch(fetchCartAsync());
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
});

export const deleteCartAsync = createAsyncThunk("cart/deleteCart", async (id, thunkAPI) => {
    try {
        const res = await deleteCartItem(id);
        thunkAPI.dispatch(fetchCartAsync());
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
});

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetCartState: (state) => {
            state.cartItems = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCartAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload?.data || [];
            })
            .addCase(fetchCartAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch cart";
            });
    },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;

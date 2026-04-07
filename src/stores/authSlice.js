import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "../features/auth/api/login";
import { getMe } from "../features/auth/api/me";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (payload, { rejectWithValue }) => {
        try {
            await loginApi(payload);
            const res = await getMe();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const fetchUser = createAsyncThunk(
    "auth/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getMe();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
        initialized: false, // true once fetchUser has completed at least once
    },
    reducers: {
        logout(state) {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.initialized = true;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.loading = false;
                state.initialized = true;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
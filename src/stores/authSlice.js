import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "../features/auth/api/login";
import { getMe } from "../features/auth/api/me";
import { signupApi } from "../features/auth/api/signup";

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

export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async (payload, { rejectWithValue }) => {
        try {
            await signupApi(payload);

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

const normalizeError = (payload) => {
    if (!payload) return "An unexpected error occurred.";
    if (typeof payload === "string") return payload;
    if (typeof payload === "object") {
        if (payload.detail) {
            if (payload.detail === "Invalid credentials.") 
                return "Wrong email or password";
            return payload.detail;
        }
        if (payload.message) return payload.message;
    }
    return String(payload);
};

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
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = normalizeError(action.payload);
            })

            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = normalizeError(action.payload);
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

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
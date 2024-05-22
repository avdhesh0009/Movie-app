import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth/authSlice";
import homeSlice from "./homeSlice";

export const store = configureStore({
    reducer: {
        home: homeSlice,
        auth: authReducer,
    },
});

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fetchUser } from "../stores/authSlice";
import AppRouter from "./router";

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    return (
        <>
            {/* 🌌 GLOBAL BACKGROUND */}
            <div className="fixed inset-0 -z-50 pointer-events-none">
                <div className="absolute inset-0 bg-[#050505]" />
                <div className="absolute inset-0 bg-[url('/bg_img.jpg')] bg-cover bg-center opacity-5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.06),transparent_40%)]" />
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('/noise.png')]" />
            </div>

            <AppRouter />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="dark"
            />
        </>
    );
}

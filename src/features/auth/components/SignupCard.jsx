import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../../stores/authSlice";
import { toast } from "react-toastify";

import Button from "@/components/Button";
import { Input, PasswordInput } from "@/components/Input";
import Label from "@/components/Label";
import logo from "@/assets/logo.png";
import Alert from "@/components/Alert";

export default function SignupCard() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validationError, setValidationError] = useState("");
    const [apiError, setApiError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    useEffect(() => {

        if (!error) {
            setApiError("");
            return;
        }

        let message = "Something went wrong";

        if (typeof error === "string") {
            message = error;
        } else if (error?.detail) {
            if (error.detail === "Invalid credentials.") {
                message = "Wrong email or password";
            } else {
                message = error.detail;
            }
        } else if (error?.message) {
            message = error.message;
        }

        setApiError(message);
    }, [error]);

    const setErr = (msg) => {
        setValidationError(msg);
        return false;
    };

    const validate = () => {
        setValidationError("");

        if (!fullName.trim()) {
            return setErr("Full name is required");
        }

        if (!email) {
            return setErr("Email is required");
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            return setErr("Invalid email");
        }

        if (!password) {
            return setErr("Password is required");
        }

        if (password.length < 8 || password.length > 128) {
            return setErr("Password must be between 8 and 128 characters");
        }

        if (!/[A-Z]/.test(password)) {
            return setErr("Password must contain at least one uppercase letter");
        }

        if (!/[a-z]/.test(password)) {
            return setErr("Password must contain at least one lowercase letter");
        }

        if (!/[0-9]/.test(password)) {
            return setErr("Password must contain at least one number");
        }

        if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]\\/+=~`]/.test(password)) {
            return setErr("Password must contain at least one special character");
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

         setApiError("");

        if (!validate()) return;

        const result = await dispatch(
            signupUser({
                full_name: fullName,
                email,
                password,
            })
        );

        if (result.meta.requestStatus === "fulfilled") {
            toast.success("Account created successfully!", {
                toastId: "signup-success",
                autoClose: 3000,
                hideProgressBar: true,
                style: {
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(30px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "1rem",
                    color: "#fff",
                },
            });
            setApiError("");
            navigate("/dashboard");
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center px-6 overflow-hidden bg-transparent">

            {/* 🧊 Card — exact pipeline card style */}
            <div className="
                relative w-full max-w-md
                bg-white/[0.08]
                border border-white/[0.15]
                rounded-2xl
                p-6
                shadow-lg
                hover:bg-white/[0.12]
                hover:-translate-y-1
                transition-all
                group
                overflow-hidden
            ">

                {/* ✨ Same radial gradient overlay as pipeline cards */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none rounded-2xl" />

                <div className="relative z-10">

                    {/* 🔰 Logo */}
                    <div className="mb-8 flex justify-center">
                        <img src={logo} alt="Logo" className="h-12 object-contain opacity-90" />
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {validationError && (
                            <Alert
                                variant="error"
                                dismissible
                                className="mb-2"
                            >
                                {validationError}
                            </Alert>
                        )}

                        {apiError && (
                            <Alert
                                variant="error"
                                dismissible
                                className="mb-2"
                            >
                                {apiError}
                            </Alert>
                        )}

                        {/* 👤 Full Name */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] uppercase tracking-widest font-black text-white/40">
                                full name
                            </Label>

                            <Input
                                type="text"
                                value={fullName}
                                onChange={(e) =>{
                                     setValidationError("");
                                     setApiError("");
                                     setFullName(e.target.value)}}
                                placeholder="John Doe"
                                className="bg-white/[0.08] border border-white/10 rounded-xl py-3"
                            />
                        </div>

                        {/* 📧 Email */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] uppercase tracking-widest font-black text-white/40">
                                e-mail address
                            </Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setValidationError("");
                                    setApiError("");
                                    setEmail(e.target.value)}}
                                placeholder="you@meetai.com"
                                className="bg-white/[0.08] border border-white/10 rounded-xl py-3"
                            />
                        </div>

                        {/* 🔒 Password */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-[9px] uppercase tracking-widest font-black text-white/40">
                                password
                            </Label>
                            <PasswordInput
                                value={password}
                                onChange={(e) => {
                                    setValidationError("");
                                    setApiError("");
                                    setPassword(e.target.value)}}
                                placeholder="••••••••"
                                className="bg-white/[0.08] border border-white/10 rounded-xl py-3"
                            />
                        </div>

                        {/* 🚀 Button — matches pipeline "Add Deal" button style */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="
                                mt-2 w-full
                                bg-white text-black
                                hover:bg-white/90
                                text-xs font-black uppercase tracking-widest
                                py-3
                                rounded-xl
                                transition-all
                                active:scale-95
                            "
                        >
                           {loading ? "Creating Account..." : "Create Account"}
                        </Button>

                        {/* Link to Login Page */}
                        <div className="mt-4 text-center">
                        <span className="text-sm text-white/60">
                            Already have an account?{" "}
                        </span>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="font-semibold text-white hover:underline"
                        >
                            Login
                        </button>
                    </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
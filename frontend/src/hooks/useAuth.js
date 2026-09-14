import { useContext } from "react";

import { AuthContext } from "../store/userContext";

import {
    userLogin,
    userRegister,
    userGetme,
    userLogout,
    userProfile,
    userVerifyEmail,
    userResendVerifyEmail,
    userContact,
    googleLogin,
    githubLogin,
    forgotPassword,
    verifyResetOTP,
    resetPassword
} from "../services/user.api";


export const useAuth = () => {

    const {
        setUser,
        setProfile,
        setLoading,
        user,
        profile,
        loading
    } = useContext(AuthContext);


    // ==================== Register ====================
    async function handleRegister({ username, email, password }) {

        setLoading(true);

        try {

            const data = await userRegister({
                username,
                email,
                password
            });

            setUser(data.user);

            return data;

        } catch (error) {

            console.log(
                "Register error:",
                error.response?.data || error.message
            );

            setUser(null);

            throw error;

        } finally {

            setLoading(false);

        }
    }


    // ==================== Login ====================
    async function handleLogin({ email, password }) {

        setLoading(true);

        try {

            const data = await userLogin({
                email,
                password
            });

            setUser(data.user);
            setProfile(data.profile);
            return data;

        } catch (error) {

            console.log(
                "Login error:",
                error.response?.data || error.message
            );

            setUser(null);

            throw error;

        } finally {

            setLoading(false);

        }
    }


    // ==================== Get Me ====================
    async function handleGetme() {

        setLoading(true);

        try {

            const data = await userGetme();

            setUser(data.user);
            setProfile(data.profile);

            return data;

        } catch (error) {

            console.log(
                "Getme error:",
                error.response?.data || error.message
            );

            setUser(null);
            setProfile(null);

            throw error;

        } finally {

            setLoading(false);

        }
    }


    // ==================== Logout ====================
    async function handleLogout() {

        setLoading(true);

        try {

            const data = await userLogout();

            setUser(null);
            setProfile(null);

            return data;

        } catch (error) {

            console.log(
                "Logout error:",
                error.response?.data || error.message
            );

            setUser(null);
            setProfile(null);

            throw error;

        } finally {

            setLoading(false);

        }
    }


    // ==================== Profile ====================
    async function handleProfile(formData) {

        setLoading(true);

        try {

            const data = await userProfile(formData);

            await handleGetme();

            return data;

        } catch (error) {

            console.log(
                "Profile error:",
                error.response?.data || error.message
            );

            throw error;

        } finally {

            setLoading(false);

        }
    }


    // ==================== Contact ====================
    async function handleContact(formData) {

        setLoading(true);

        try {

            return await userContact(formData);

        } catch (error) {

            console.log(
                "Contact error:",
                error.response?.data || error.message
            );

            throw error;

        } finally {

            setLoading(false);

        }
    }


    // ==================== Google Login ====================
    async function handleGoogleLogin() {

        return googleLogin();

    }


    // ==================== GitHub Login ====================
    async function handleGithubLogin() {

        return githubLogin();

    }


    // ==================== Verify Email ====================
    async function handleVerifyEmail(token) {

        setLoading(true);

        try {

            return await userVerifyEmail(token);

        } catch (error) {

            console.log(
                "Verify Email error:",
                error.response?.data || error.message
            );

            throw error;

        } finally {

            setLoading(false);

        }
    }


    // ==================== Resend Verify Email ====================
    async function handleResendVerifyEmail() {

        setLoading(true);

        try {

            return await userResendVerifyEmail();

        } catch (error) {

            console.log(
                "Resend Verify Email error:",
                error.response?.data || error.message
            );

            throw error;

        } finally {

            setLoading(false);

        }
    }


    // ==================== Forgot Password ====================
    async function handleForgotPassword(email) {

        setLoading(true);

        try {

            return await forgotPassword(email);

        } catch (error) {

            console.log(
                "Forgot Password error:",
                error.response?.data || error.message
            );

            throw error;

        } finally {

            setLoading(false);

        }
    }


    // ==================== Verify Reset OTP ====================
    async function handleVerifyResetOTP({ email, otp }) {

        setLoading(true);

        try {

            return await verifyResetOTP({
                email,
                otp
            });

        } catch (error) {

            console.log(
                "Verify OTP error:",
                error.response?.data || error.message
            );

            throw error;

        } finally {

            setLoading(false);

        }
    }


    // ==================== Reset Password ====================
    async function handleResetPassword({ email, newPassword }) {

        setLoading(true);

        try {

            return await resetPassword({
                email,
                newPassword
            });

        } catch (error) {

            console.log(
                "Reset Password error:",
                error.response?.data || error.message
            );

            throw error;

        } finally {

            setLoading(false);

        }
    }


    return {
        user,profile,loading,
        handleRegister,
        handleLogin,
        handleGetme,
        handleLogout,
        handleProfile,
        handleVerifyEmail,
        handleResendVerifyEmail,
        handleContact,
        handleGoogleLogin,
        handleGithubLogin,
        handleForgotPassword,
        handleVerifyResetOTP,
        handleResetPassword
    };
};


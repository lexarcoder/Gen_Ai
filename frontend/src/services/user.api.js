import axios from "axios"

const api= axios.create({
    baseURL: "http://localhost:3000/auth",
    withCredentials:true
})

// ==================== Login ====================

export async function userLogin({email, password}) {
    const response = await api.post("/login",{
        email,
        password
    })
    return response.data;
    
}


// ==================== Register ====================

export async function userRegister({ username, email, password }) {
 const response = await api.post("/register",{
    username,
    email,
    password
 })   
 return response.data
}

// ==================== Get me ====================
export async function userGetme() {
    const response = await api.get("/get-me")
    return response.data;

}


// ==================== logOut ====================

export async function userLogout() {
    const response = await api.get("/logout")
    return response.data
    
}

// ==================== User email verify ====================


export async function userVerifyEmail(token) {
    const response = await api.post("/verify-email",{
        params: {
            token,
        },
    })
    return response.data
}

// ==================== Resend Verification Email ====================

export async function userResendVerifyEmail() {
    const response = await api.post("/resend-verification-email")
    
    return response.data
}

// ==================== Profile ====================

export async function userProfile(formData) {
    const response = await api.post(
        "/profile",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
    
}


// ==================== Contact Me ====================

export async function userContact(data) {
    const response = await api.post("/contact",data)
    return response.data
}

// ==================== Google OAuth ====================

export function googleLogin() {
      window.location.href = `${api.defaults.baseURL}/google`;
}


// ==================== Github OAuth ====================

export function githubLogin() {
      window.location.href = `${api.defaults.baseURL}/github`;
}


// ==================== Forgot Password ====================

export async function forgotPassword(email) {
    const response = await api.post("/forgot-password", {email})
    return response.data
}


// ==================== Verify Reset OTP ====================

export async function verifyResetOTP({ email, otp }) {
    const response = await api.post(
        "/verify-otp",
        {
            email,
            otp,
        }
    );

    return response.data;
}


// ==================== Reset Password ====================

export async function resetPassword({
    email,
    newPassword,
}) {
    const response = await api.post(
        "/reset-password",
        {
            email,
            newPassword,
        }
    );

    return response.data;
}

// Valid users for the internal tool
const VALID_USERS = [
    { email: "solisgreenenergysolutions@gmail.com", password: "Admin@1985", role: "admin" },
    { email: "joshijacob@gmail.com", password: "Joshi@1985", role: "sales" }
];

// Check if we are on the login page
const isLoginPage = window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('/login');

// Check authentication status
const isAuthenticated = sessionStorage.getItem('solis_auth_token') === 'true';
const userRole = sessionStorage.getItem('solis_user_role');

if (!isAuthenticated && !isLoginPage) {
    // Redirect unauthorized users to login page
    window.location.href = 'login.html';
} else if (isAuthenticated && isLoginPage) {
    // Redirect already logged-in users away from login page
    window.location.href = 'index.html';
} else if (isAuthenticated) {
    // Authorization Check: Prevent sales from accessing admin/master pages
    const path = window.location.pathname.toLowerCase();
    const isAdminPage = path.includes('admin.html') || path.includes('_master.html');
    if (isAdminPage && userRole !== 'admin') {
        window.location.href = 'index.html';
    }
}

async function attemptLogin(email, password) {
    // 2. If not a local user, try actual Firebase Authentication
    if (typeof authFirebase === 'undefined') {
        throw new Error("Firebase is not initialized. Please check your internet connection.");
    }
    
    try {
        // Try to sign in
        const userCredential = await authFirebase.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        sessionStorage.setItem('solis_auth_token', 'true');
        sessionStorage.setItem('solis_user_email', user.email);
        
        if (user.email.toLowerCase() === "solisgreenenergysolutions@gmail.com") {
            sessionStorage.setItem('solis_user_role', 'admin');
        } else {
            sessionStorage.setItem('solis_user_role', 'sales');
        }
        
        window.location.href = 'index.html';
        return true;
    } catch (error) {
        console.warn("Sign in failed, attempting to register user in Firebase...", error);
        
        // Auto-register if the user is in our VALID_USERS list
        const isValidUser = VALID_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (isValidUser) {
            try {
                const userCredential = await authFirebase.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                sessionStorage.setItem('solis_auth_token', 'true');
                sessionStorage.setItem('solis_user_email', user.email);
                sessionStorage.setItem('solis_user_role', isValidUser.role);
                
                window.location.href = 'index.html';
                return true;
            } catch (createError) {
                console.error("Failed to auto-register user in Firebase:", createError);
                throw new Error(createError.message || "Invalid email or password.");
            }
        }
        
        console.error("Firebase Auth Error:", error);
        throw new Error("Invalid email or password.");
    }
}

function logout() {
    sessionStorage.removeItem('solis_auth_token');
    sessionStorage.removeItem('solis_user_email');
    sessionStorage.removeItem('solis_user_role');
    window.location.href = 'login.html';
}

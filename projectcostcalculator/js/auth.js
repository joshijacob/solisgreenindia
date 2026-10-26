// Valid users for the internal tool
const VALID_USERS = [
    { email: "solisgreenenergysolutions@gmail.com", password: "Admin@1985", role: "admin" },
    { email: "joshijacob@gmail.com", password: "Joshi@1985", role: "sales" }
];

// Cross-tab sync: restore sessionStorage from localStorage if available
if (sessionStorage.getItem('solis_auth_token') !== 'true' && localStorage.getItem('solis_auth_token') === 'true') {
    sessionStorage.setItem('solis_auth_token', 'true');
    sessionStorage.setItem('solis_user_email', localStorage.getItem('solis_user_email') || '');
    sessionStorage.setItem('solis_user_role', localStorage.getItem('solis_user_role') || 'sales');
}

// Check if we are on a login page
const isLoginPage = window.location.pathname.endsWith('login.html') || 
                    window.location.pathname.endsWith('/login') || 
                    window.location.pathname.toLowerCase().includes('/login/');

// Check authentication status
const isAuthenticated = sessionStorage.getItem('solis_auth_token') === 'true';
const userRole = sessionStorage.getItem('solis_user_role');

if (!isAuthenticated && !isLoginPage) {
    // Redirect unauthorized users to central Login page with return target
    const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = '/Login/index.html?redirect=' + currentPath;
} else if (isAuthenticated && isLoginPage && !window.location.pathname.toLowerCase().includes('/login/index.html')) {
    // Redirect already logged-in users to index.html or Login hub
    window.location.href = '/projectcostcalculator/index.html';
} else if (isAuthenticated) {
    // Authorization Check: Prevent sales from accessing admin/master pages
    const path = window.location.pathname.toLowerCase();
    const isAdminPage = path.includes('admin.html') || path.includes('_master.html');
    if (isAdminPage && userRole !== 'admin') {
        window.location.href = '/projectcostcalculator/index.html';
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
        localStorage.setItem('solis_auth_token', 'true');
        localStorage.setItem('solis_user_email', user.email);
        
        const role = (user.email.toLowerCase() === "solisgreenenergysolutions@gmail.com") ? 'admin' : 'sales';
        sessionStorage.setItem('solis_user_role', role);
        localStorage.setItem('solis_user_role', role);
        
        window.location.href = '/projectcostcalculator/index.html';
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
                localStorage.setItem('solis_auth_token', 'true');
                localStorage.setItem('solis_user_email', user.email);
                localStorage.setItem('solis_user_role', isValidUser.role);
                
                window.location.href = '/projectcostcalculator/index.html';
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
    localStorage.removeItem('solis_auth_token');
    localStorage.removeItem('solis_user_email');
    localStorage.removeItem('solis_user_role');
    if (typeof authFirebase !== 'undefined') {
        authFirebase.signOut().catch(() => {});
    }
    window.location.href = '/Login/index.html';
}

// Valid users for the internal tool
const VALID_USERS = [
    { email: "solisgreenenergysolutions@gmail.com", password: "Admin@1985", role: "admin", name: "Solis Super Admin" },
    { email: "joshijacob@gmail.com", password: "Joshi@1985", role: "sales", name: "Joshi Jacob" }
];

// Resolves a human-friendly Sales Executive Name from email or custom value
function resolveSalesExecutiveName(email, fallbackName = '') {
    if (fallbackName && fallbackName.trim() && !fallbackName.includes('@')) {
        return fallbackName.trim();
    }
    if (!email) return 'Sales Executive';
    const norm = email.toLowerCase().trim();
    
    // 1. Direct match from VALID_USERS
    const known = VALID_USERS.find(u => u.email.toLowerCase() === norm);
    if (known && known.name) return known.name;
    
    // 2. Direct match from User Management database (solis_users_db)
    try {
        const dbUsers = JSON.parse(localStorage.getItem('solis_users_db') || '[]');
        const matched = dbUsers.find(u => u.email && u.email.toLowerCase() === norm);
        if (matched && matched.name) return matched.name;
    } catch(e) {}
    
    // 3. Known admin/solis aliases
    if (norm === 'solisgreenenergysolutions@gmail.com' || norm.includes('solisgreenenergy')) {
        return 'Solis Super Admin';
    }
    if (norm.includes('admin')) return 'Solis Admin';
    
    // 4. Clean format from email prefix
    const prefix = norm.split('@')[0];
    return prefix.split(/[._-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}
window.resolveSalesExecutiveName = resolveSalesExecutiveName;

// Cross-tab sync: restore sessionStorage from localStorage if available
if (sessionStorage.getItem('solis_auth_token') !== 'true' && localStorage.getItem('solis_auth_token') === 'true') {
    sessionStorage.setItem('solis_auth_token', 'true');
    sessionStorage.setItem('solis_user_email', localStorage.getItem('solis_user_email') || '');
    sessionStorage.setItem('solis_user_role', localStorage.getItem('solis_user_role') || 'sales');
    sessionStorage.setItem('solis_user_name', localStorage.getItem('solis_user_name') || '');
    sessionStorage.setItem('solis_user_permissions', localStorage.getItem('solis_user_permissions') || '{}');
}

// Auto-fill user name if missing but email is present
const currentEmail = sessionStorage.getItem('solis_user_email') || localStorage.getItem('solis_user_email');
let currentName = sessionStorage.getItem('solis_user_name') || localStorage.getItem('solis_user_name');
if ((!currentName || currentName.includes('@')) && currentEmail) {
    currentName = resolveSalesExecutiveName(currentEmail);
    sessionStorage.setItem('solis_user_name', currentName);
    localStorage.setItem('solis_user_name', currentName);
}

// Check if we are on a login page
const isLoginPage = window.location.pathname.endsWith('login.html') || 
                    window.location.pathname.endsWith('/login') || 
                    window.location.pathname.toLowerCase().includes('/login/');

// Check authentication status
const isAuthenticated = sessionStorage.getItem('solis_auth_token') === 'true';
const userRole = sessionStorage.getItem('solis_user_role');
const userEmail = (sessionStorage.getItem('solis_user_email') || '').toLowerCase();
const isSuperAdmin = (userEmail === 'solisgreenenergysolutions@gmail.com');

if (!isAuthenticated && !isLoginPage) {
    // Redirect unauthorized users to central Login page with return target
    const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = '/Login/index.html?redirect=' + currentPath;
} else if (isAuthenticated && isLoginPage && !window.location.pathname.toLowerCase().includes('/login/index.html')) {
    // Redirect already logged-in users to index.html or Login hub
    window.location.href = '/projectcostcalculator/index.html';
} else if (isAuthenticated) {
    const path = window.location.pathname.toLowerCase();
    
    // Protect User Management module: Super Admin only
    if (path.includes('/users/') && !isSuperAdmin) {
        alert("Access Denied: Only Super Admin (solisgreenenergysolutions@gmail.com) can access User Management.");
        window.location.href = '/Login/index.html';
    }

    // Authorization Check: Prevent unauthorized users from accessing admin/master pages
    const isAdminPage = path.includes('admin.html') || path.includes('_master.html');
    if (isAdminPage) {
        let userPerms = {};
        try {
            userPerms = JSON.parse(sessionStorage.getItem('solis_user_permissions') || '{}');
        } catch(e) {}

        const canAccessMaster = isSuperAdmin || userRole === 'admin' || userRole === 'engineering' || userPerms['bom_master'] === true;
        if (!canAccessMaster) {
            window.location.href = '/Login/index.html';
        }
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
        const userName = resolveSalesExecutiveName(user.email, user.displayName);
        sessionStorage.setItem('solis_user_role', role);
        sessionStorage.setItem('solis_user_name', userName);
        localStorage.setItem('solis_user_role', role);
        localStorage.setItem('solis_user_name', userName);
        
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
                sessionStorage.setItem('solis_user_name', isValidUser.name || resolveSalesExecutiveName(user.email));
                localStorage.setItem('solis_auth_token', 'true');
                localStorage.setItem('solis_user_email', user.email);
                localStorage.setItem('solis_user_role', isValidUser.role);
                localStorage.setItem('solis_user_name', isValidUser.name || resolveSalesExecutiveName(user.email));
                
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
    sessionStorage.removeItem('solis_user_name');
    sessionStorage.removeItem('solis_user_permissions');
    sessionStorage.removeItem('solis_admin_logged_in');
    localStorage.removeItem('solis_auth_token');
    localStorage.removeItem('solis_user_email');
    localStorage.removeItem('solis_user_role');
    localStorage.removeItem('solis_user_name');
    localStorage.removeItem('solis_user_permissions');
    localStorage.removeItem('solis_admin_logged_in');
    if (typeof authFirebase !== 'undefined') {
        authFirebase.signOut().catch(() => {});
    }
    window.location.href = '/Login/index.html';
}

function handleLogout() {
    logout();
}
window.handleLogout = handleLogout;
window.logout = logout;

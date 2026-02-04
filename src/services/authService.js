// Simulates a real backend API using LocalStorage
const STORAGE_KEY = 'smart_home_users';
const SESSION_KEY = 'smart_home_session';

export const authService = {
    // R1: Sign up form for new users
    register: (name, email, password) => {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        
        // Check if user exists
        if (users.find(u => u.email === email)) {
            throw new Error("User already exists with this email.");
        }

        // Save new user
        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

        // Auto-login after signup (Requirement: "user is logged in immediately")
        localStorage.setItem(SESSION_KEY, JSON.stringify({ name, email }));
        return newUser;
    },

    // R1: Login form
    login: (email, password) => {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error("Invalid Credentials"); // Requirement R1
        }

        // Create session
        localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
        return user;
    },

    // R8: Logout functionality
    logout: () => {
        localStorage.removeItem(SESSION_KEY);
    },

    // Check if logged in
    isAuthenticated: () => {
        return !!localStorage.getItem(SESSION_KEY);
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    }
};

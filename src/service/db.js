export const DB_KEYS = {
    USERS: 'dayflow_users',
    ATTENDANCE: 'dayflow_attendance',
    LEAVES: 'dayflow_leaves',
    CURRENT_USER: 'dayflow_current_user',
};

const INITIAL_ADMIN = {
    id: 'admin_1',
    name: 'Admin User',
    email: 'admin@dayflow.com',
    password: 'admin', // In a real app, this would be hashed
    role: 'admin',
    department: 'HR',
    jobTitle: 'HR Manager',
    salary: 50000,
    joinedDate: '2025-01-01',
};

// Helper for ID Generation
const generateLoginId = (companyName, userName, count) => {
    // OI -> First 2 letters of Company (Upper)
    // JODO -> First 2 letters of First and Last Name (Upper)
    // 2022 -> Year
    // 0001 -> Serial

    const companyCode = companyName.replace(/\s/g, '').substring(0, 2).toUpperCase();

    const nameParts = userName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : firstName; // Fallback if single name
    const userCode = (firstName.substring(0, 2) + lastName.substring(0, 2)).toUpperCase();

    const year = new Date().getFullYear();
    const serial = String(count + 1).padStart(4, '0');

    return `${companyCode}${userCode}${year}${serial}`;
};

export const db = {
    getUsers: () => {
        const users = localStorage.getItem(DB_KEYS.USERS);
        return users ? JSON.parse(users) : [INITIAL_ADMIN];
    },

    checkInitialized: () => {
        if (!localStorage.getItem(DB_KEYS.USERS)) {
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify([INITIAL_ADMIN]));
        }
    },

    createUser: (userData, companyName) => {
        const users = db.getUsers();

        // Calculate serial based on year? Or total? 
        // Requirement says "Serial Number of Joining for that Year". 
        // Simplification: Count users in that company for this year.
        const currentYear = new Date().getFullYear();
        const count = users.filter(u => u.companyName === companyName && u.joinedDate.startsWith(String(currentYear))).length;

        const loginId = generateLoginId(companyName, userData.name, count);

        const newUser = {
            ...userData,
            id: loginId, // Use generated ID as the primary ID
            loginId: loginId,
            companyName: companyName,
            joinedDate: new Date().toISOString().split('T')[0],
        };

        users.push(newUser);
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
        return newUser;
    },

    updateUser: (updatedUser) => {
        const users = db.getUsers().map(u => u.id === updatedUser.id ? updatedUser : u);
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    },

    authenticate: (identifier, password) => {
        db.checkInitialized();
        const users = db.getUsers();
        // Allow login by Email OR Login ID
        return users.find(u => (u.email === identifier || u.loginId === identifier) && u.password === password);
    },

    // Attendance
    getAttendance: () => {
        const data = localStorage.getItem(DB_KEYS.ATTENDANCE);
        return data ? JSON.parse(data) : [];
    },

    addAttendance: (record) => {
        const data = db.getAttendance();
        data.push(record);
        localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(data));
    },

    updateAttendance: (updatedRecord) => {
        const data = db.getAttendance().map(r => r.id === updatedRecord.id ? updatedRecord : r);
        localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(data));
    },

    // Leaves
    getLeaves: () => {
        const data = localStorage.getItem(DB_KEYS.LEAVES);
        return data ? JSON.parse(data) : [];
    },

    addLeave: (leave) => {
        const data = db.getLeaves();
        data.push(leave);
        localStorage.setItem(DB_KEYS.LEAVES, JSON.stringify(data));
    },

    updateLeave: (updatedLeave) => {
        const data = db.getLeaves().map(l => l.id === updatedLeave.id ? updatedLeave : l);
        localStorage.setItem(DB_KEYS.LEAVES, JSON.stringify(data));
    }
};

// Initialize on load
db.checkInitialized();

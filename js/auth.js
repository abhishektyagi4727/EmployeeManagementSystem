function login() {
  const role = document.getElementById('role').value;
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }

  if (!email.includes('@')) {
    alert('Please enter a valid email');
    return;
  }

  // Demo credentials
  const validCredentials = {
    'admin': { email: 'admin@company.com', password: 'password123' },
    'employee': { email: 'employee@company.com', password: 'password123' }
  };

  const creds = validCredentials[role];
  
  if (!creds) {
    alert('Invalid role selected');
    return;
  }

  if (email === creds.email.toLowerCase() && password === creds.password) {
    localStorage.setItem('role', role);
    localStorage.setItem('user', email);
    localStorage.setItem('userId', role === 'admin' ? 'ADMIN001' : 'EMP001');
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid email or password. Please use:\nEmail: ' + creds.email + '\nPassword: ' + creds.password);
  }
}

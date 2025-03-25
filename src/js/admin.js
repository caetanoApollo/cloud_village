const API_BASE_URL = 'http://localhost:3000';

function toggleForms() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        setTimeout(() => {
            loginForm.style.opacity = "1";
            registerForm.style.opacity = "0";
        }, 10); 
    } else {
        registerForm.style.display = "block";
        loginForm.style.display = "none";
        setTimeout(() => {
            registerForm.style.opacity = "1";
            loginForm.style.opacity = "0";
        }, 10); 
    }
}

function togglePasswordVisibility(id) {
    const passwordField = document.getElementById(id);
    const eyeIcon = passwordField.nextElementSibling.querySelector('i');

    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.classList.remove("bi-eye");
        eyeIcon.classList.add("bi-eye-slash");
    } else {
        passwordField.type = "password";
        eyeIcon.classList.remove("bi-eye-slash");
        eyeIcon.classList.add("bi-eye");
    }
}

document.getElementById("login").addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!email.endsWith('@cloudvillage.com.br')) {
        alert("Por favor, use um email com o domínio @cloudvillage.com.br");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('loggedIn', 'true');
            window.location.href = '/dashboard';
        } else {
            alert(data.message || 'Login falhou. Verifique suas credenciais.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao tentar fazer login');
    }
});

document.getElementById("register").addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Verifica se o email termina com @cloudvillage.com.br
    if (!email.endsWith('@cloudvillage.com.br')) {
        alert("Por favor, use um email com o domínio @cloudvillage.com.br");
        return;
    }

    if (password !== confirmPassword) {
        alert("As senhas não coincidem!");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('loggedIn', 'true');
            alert(`Cadastro realizado com sucesso para o email: ${email}`);
            toggleForms();
        } else {
            alert(data.message || 'Falha no cadastro');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao cadastrar. Tente novamente.');
    }
});
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api/auth';
const username = 'testuser_auto_' + Math.floor(Math.random() * 10000);
const email = username + '@test.com';
const password = '123456';

async function testRegisterAndLogin() {
    console.log('Kayıt olunuyor:', username, email);
    const registerRes = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
    const registerData = await registerRes.json();
    console.log('Register yanıtı:', registerData);

    console.log('Login deneniyor:', username);
    const loginRes = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const loginData = await loginRes.json();
    console.log('Login yanıtı:', loginData);
}

testRegisterAndLogin(); 
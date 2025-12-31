const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Login API - đã test thành công
export async function login(username, password) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('grant_type', 'password');
  
  console.log('📞 API Login gửi:', { username });
  
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: formData.toString(),
  });
  
  console.log('✅ Login response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Login failed:', errorText);
    throw new Error('Sai tên đăng nhập hoặc mật khẩu');
  }
  
  const data = await response.json();
  console.log('✅ Login success:', { 
    access_token: data.access_token ? 'CÓ' : 'KHÔNG',
    token_type: data.token_type 
  });
  
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
  }
  
  return data;
}

// Register API - đã test thành công
export async function register(userData) {
  console.log('📞 API Register gửi:', userData);
  
  // Lấy username từ email (phần trước @)
  const email = userData.email.trim();
  const username = email.split('@')[0]; // toibeo@gmail.com -> toibeo
  
  const backendData = {
    username: username,
    email: email,
    password: userData.password,
    fullname: userData.fullname
  };
  
  console.log('Backend data sẽ gửi:', backendData);
  
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(backendData)
  });
  
  console.log('Register response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Register failed:', errorText);
    throw new Error('Đăng ký thất bại. Email đã tồn tại!');
  }
  
  const data = await response.json();
  console.log('Register success:', data);
  
  return data;
}

// Các API khác
export async function getHotels() {
  const response = await fetch(`${API_URL}/hotels/`);
  if (!response.ok) throw new Error('Failed to fetch hotels');
  return response.json();
}

export async function getRooms() {
  const response = await fetch(`${API_URL}/rooms/`);
  if (!response.ok) throw new Error('Failed to fetch rooms');
  return response.json();
}

// Export tất cả
export default {
  login,
  register,
  getHotels,
  getRooms
};
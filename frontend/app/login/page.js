.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 440px;
  margin: 20px auto;
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.auth-subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 32px;
  font-size: 14px;
}

.auth-form {
  margin-top: 32px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #0070f3;
  box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.input-hint {
  font-size: 12px;
  color: #666;
  margin-top: 6px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-container input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.forgot-password {
  color: #0070f3;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password:hover {
  color: #0051cc;
  text-decoration: underline;
}

.btn-auth {
  width: 100%;
  padding: 16px;
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.btn-auth:hover:not(:disabled) {
  background: #0051cc;
}

.btn-auth:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
  color: #999;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #eee;
}

.divider span {
  padding: 0 16px;
  font-size: 14px;
}

.alternative-login {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.btn-social {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.btn-social:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.btn-google {
  color: #333;
}

.btn-facebook {
  color: #1877F2;
  border-color: #1877F2;
}

.btn-facebook:hover {
  background-color: #f0f8ff;
}

.auth-footer {
  text-align: center;
  margin-top: 32px;
  color: #666;
  font-size: 14px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.auth-link {
  color: #0070f3;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.auth-link:hover {
  text-decoration: underline;
}

.auth-terms {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: #888;
  line-height: 1.5;
}

.auth-terms a {
  color: #0070f3;
  text-decoration: none;
}

.auth-terms a:hover {
  text-decoration: underline;
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #fcc;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-card {
    padding: 24px;
    margin: 10px;
  }
  
  .auth-title {
    font-size: 24px;
  }
  
  .form-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .btn-social {
    font-size: 13px;
    padding: 12px;
  }
}

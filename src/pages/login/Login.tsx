import Input from '../../components/input/Input';
import { inputTexts } from '../../constants/texts';
import { Alert, Button } from '@mantine/core';
import './Login.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconAlertTriangle } from '@tabler/icons-react';
import axiosInstance from '../../axiosInstance';

export const Login: React.FC = () => {
  const fields: (keyof typeof inputTexts)[] = ['email', 'password'];
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleLogin = async () => {
  const username = formValues.email.trim();
  const password = formValues.password.trim();

  if (!username || !password) {
    setError('Please enter both username and password.');
    return;
  }

  try {
    const res = await axiosInstance.post('/login', { username, password });
    const { accessToken, refreshToken, user } = res.data;

    localStorage.setItem('authToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    localStorage.setItem('user', JSON.stringify(user));

    setError('');
    navigate('/');
  } catch (e: any) {
    const msg = e?.response?.data?.error || 'Login failed';
    setError(msg);
  }
};
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof typeof inputTexts,
  ) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: event.target.value,
    }));
  };

  return (
    <div className="inputs">
      <h2>Login</h2>
      {error === 'Invalid email or password' && (
        <Alert
          variant="light"
          color="red"
          radius="md"
          title="Email or password is incorrect!"
          icon={<IconAlertTriangle />}
          withCloseButton
          onClose={() => setError('')}
          mt="md"
        >
          Please check your credentials or{' '}
          <a href="/sign-up" style={{ textDecoration: 'underline' }}>
            create an account
          </a>
          .
        </Alert>
      )}
      {fields.map(field => (
        <div className="input" key={field}>
          <Input
            placeholder={inputTexts[field].placeholder}
            description={inputTexts[field].description}
            label={inputTexts[field].label}
            value={formValues[field]}
            onChange={e => handleChange(e, field)}
          />
        </div>
      ))}
      <div className="error">{error && <div>{error}</div>}</div>
      <div className="submit">
        <Button variant="filled" size="md" radius="md" onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  );
};

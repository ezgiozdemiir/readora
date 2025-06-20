import Input from '../../components/input/Input';
import { inputTexts } from '../../constants/texts';
import { Button, Modal, Text, Alert } from '@mantine/core';
import { IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SignUp: React.FC = () => {
  const fields: (keyof typeof inputTexts)[] = ['email', 'password'];
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof typeof inputTexts,
  ) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: event.target.value,
    }));
  };

  const handleSignUp = async () => {
    const email = formValues.email.trim().toLowerCase();
    const password = formValues.password.trim();

    const res = await fetch(`http://localhost:3001/users?email=${email}`);
    const users = await res.json();

    if (users.length > 0) {
      setError('User with this email already exists');
      return;
    }

    const newUser = { email, password };

    const createRes = await fetch(`http://localhost:3001/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });

    if (createRes.ok) {
      const createdUser = await createRes.json();
      localStorage.setItem('user', JSON.stringify(createdUser));
      setError('');
      navigate('/');
    } else {
      setError('Failed to create user');
    }
  };
  const icon = <IconInfoCircle />;
  return (
    <div className="inputs">
      <h2>Create an Account</h2>
      {error === 'User with this email already exists' && (
        <Alert
          variant="light"
          color="red"
          radius="md"
          title="This account has already exist!"
          icon={<IconAlertTriangle />}
          withCloseButton
          onClose={() => setError('')}
          mt="md"
        >
          Please go to{' '}
          <a href="/login" style={{ textDecoration: 'underline' }}>
            login page
          </a>
          to enter your account.
        </Alert>
      )}
      {error === 'Failed to create user' && (
        <Alert
          variant="light"
          color="red"
          radius="md"
          title="Something went wrong in the system!"
          icon={<IconAlertTriangle />}
          withCloseButton
          onClose={() => setError('')}
          mt="md"
        >
          Please try again later.
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
        <Button variant="filled" size="md" radius="md" onClick={handleSignUp}>
          Login
        </Button>
      </div>
    </div>
  );
};

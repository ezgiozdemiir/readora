import React from 'react';
import { Container, Group, Button } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/Readora.png';
import './NavBar.scss';

const NavBar: React.FC = () => {
  const useLogout = () => {
    const navigate = useNavigate();
    return () => {
      localStorage.removeItem('user');
      navigate('/');
    };
  };
  const logout = useLogout();
  return (
    <Container className="navbar">
      <Group>
        <img src={logo} alt="readora" />
        <Button component={Link} to="/" variant="light" color="blue">
          Home
        </Button>
        <Button component={Link} to="/profile" variant="light" color="blue">
          Profile
        </Button>
        <Button component={Link} to="/login" variant="light" color="blue">
          Login
        </Button>
        <Button onClick={logout} variant="light" color="red">
          Logout
        </Button>
      </Group>
    </Container>
  );
};

export default NavBar;

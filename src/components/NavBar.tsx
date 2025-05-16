import React from 'react';
import { Container, Group, Button } from '@mantine/core';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <Container>
      <Group >
        <Button component={Link} to="/" variant="light" color="blue">Home</Button>
      </Group>
    </Container>
  );
};

export default NavBar;

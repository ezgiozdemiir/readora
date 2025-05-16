import React from 'react';
import { Container, Flex, Button } from '@mantine/core';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <Container>
      <Flex direction="row" >
        <Button component={Link} to="/" variant="light" color="blue">Home</Button>
      </Flex>
    </Container>
  );
};

export default NavBar;

import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter } from 'react-router-dom';
import NavBar from './NavBar';

//Logo'yu mocklamayınca hata veriyor, Jest image dosyalarını import edemiyor, dosyayı çözümleyemiyor. Burada aslında import etme 'mocked-logo.png' stringini döndür diyoruz.
jest.mock('../../assets/Readora.png', () => 'mocked-logo.png');

test('NavBar matches snapshot', () => {
  const { asFragment } = render(
    <MantineProvider>
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    </MantineProvider>
  );
  expect(asFragment()).toMatchSnapshot();
});
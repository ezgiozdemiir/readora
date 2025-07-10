import { render, screen, waitFor } from '@testing-library/react'
import user from '@testing-library/user-event'
import { Login } from './Login'
import { MantineProvider } from '@mantine/core'
import fetchMock from 'jest-fetch-mock'
import { MemoryRouter } from 'react-router-dom'

//KULLANICININ BAŞARILI LOGIN OLMA SENARYOSU:
fetchMock.enableMocks()
beforeEach(() => {
    fetchMock.resetMocks()
    localStorage.clear()
})

test('it calls handleLogin when the login form submitted', async () => {
    fetchMock.mockResponseOnce(
        JSON.stringify([{ email: 'jane@example.com', password: '12345678' }])
    )
    render(
        <MantineProvider>
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        </MantineProvider>
    )

    // Labela göre email inputunun içindeki text bulunur (i büyük küçük harfi dikkate almaması için yapılıyor)
    const emailInput = screen.getByLabelText(/e-mail/i)
    // Labela göre password inputunun içindeki text bulunur
    const passwordInput = screen.getByLabelText(/password/i)

    // Kullanıcı bilgilerini yazıyor
    await user.type(emailInput, 'jane@example.com')
    await user.type(passwordInput, '12345678')

    // Login butonunu bulup tıklanıyor
    const button = screen.getByRole('button', { name: /login/i })
    await user.click(button)

    // Assertion
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem('user')).toBeTruthy()
})

//KULLANICININ LOGİNİ FAİL OLURSA:

test('it shows error message when login fails', async () => {
    //Boş response mocklanıyor
    fetchMock.mockResponseOnce(JSON.stringify([]))
    render(
        <MantineProvider>
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        </MantineProvider>
    )

    //Inputlara yanlış bilgi giriliyor (hem label hem placeholder ile bulmayı denedim)
    const emailInput =
        screen.getByLabelText(/e-mail/i) ||
        screen.getByPlaceholderText(/email/i)
    const passwordInput =
        screen.getByLabelText(/password/i) ||
        screen.getByPlaceholderText(/password/i)

    await user.type(emailInput, 'wrong@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /login/i }))

    //Error mesajını bekle
    await waitFor(() => {
        expect(
            screen.getByText(/invalid email or password/i)
        ).toBeInTheDocument()
    })
})

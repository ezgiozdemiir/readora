import { render, screen, waitFor } from '@testing-library/react'
import user from '@testing-library/user-event'
import { Login } from './Login'
import { MantineProvider } from '@mantine/core'
import { MemoryRouter } from 'react-router-dom'
import axiosInstance from '../../axiosInstance'
import { UserProvider } from '../../contexts/UserContext'

jest.mock('../../axiosInstance', () => ({
    __esModule: true,
    default: { post: jest.fn() },
}))

const renderLogin = () =>
    render(
        <MantineProvider>
            <MemoryRouter>
                <UserProvider>
                    <Login />
                </UserProvider>
            </MemoryRouter>
        </MantineProvider>
    )

//KULLANICININ BAŞARILI LOGIN OLMA SENARYOSU:
beforeEach(() => {
    ;(axiosInstance.post as jest.Mock).mockReset()
    localStorage.clear()
})

test('calls handleLogin when the login form submitted', async () => {
    ;(axiosInstance.post as jest.Mock).mockResolvedValueOnce({
        data: { user: { id: 1, username: 'admin' }, token: '123456' },
        status: 200,
    })
    renderLogin()

    // Labela göre email inputunun içindeki text bulunur (i büyük küçük harfi dikkate almaması için yapılıyor)
    const usernameInput = screen.getByLabelText(/username/i)
    // Labela göre password inputunun içindeki text bulunur
    const passwordInput = screen.getByLabelText(/password/i)

    // Kullanıcı bilgilerini yazıyor
    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, '123456')

    // Login butonunu bulup tıklanıyor
    const button = screen.getByRole('button', { name: /login/i })
    await user.click(button)

    // Assertion
    await waitFor(() => {
        expect(axiosInstance.post).toHaveBeenCalledTimes(1)
        expect(localStorage.getItem('user')).toBeTruthy()
    })
})

//KULLANICININ LOGİNİ FAİL OLURSA:

test('it shows error message when login fails', async () => {
    //Boş response mocklanıyor
    ;(axiosInstance.post as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
            status: 401,
            data: { error: 'Username or password' },
        },
    })

    renderLogin()

    //Inputlara yanlış bilgi giriliyor (hem label hem placeholder ile bulmayı denedim)
    const usernameInput =
        screen.getByLabelText(/username/i) ||
        screen.getByPlaceholderText(/username/i)
    const passwordInput =
        screen.getByLabelText(/password/i) ||
        screen.getByPlaceholderText(/password/i)

    await user.type(usernameInput, 'wrong')
    await user.type(passwordInput, 'wrongpas')
    await user.click(screen.getByRole('button', { name: /login/i }))

    //Error mesajını bekle
    expect(await screen.findByTestId('login-error')).toBeInTheDocument()
    expect(
        screen.getByText(/username or password is incorrect/i)
    ).toBeInTheDocument()
})

//YUP VALIDATIONS
test('empty submit -> shows required errors and does not call API', async () => {
    renderLogin()

    // Kullanıcı Login butonunu bulup bastı
    await user.click(screen.getByRole('button', { name: /login/i }))

    // Hiçbir alan doldurulmadığı için gelen hata mesajları bunlar bekleniyor:
    expect(
        await screen.findByText(/Username is required./i)
    ).toBeInTheDocument()
    expect(
        await screen.findByText(/Password is required./i)
    ).toBeInTheDocument()

    // API çağrısı yapılmamalı çünkü validationdan geçemedi
    expect(axiosInstance.post).not.toHaveBeenCalled()
})

test('short password -> shows min length error and does not call API', async () => {
    renderLogin()

    await user.type(screen.getByLabelText(/username/i), 'admin')
    //Olması gerekenden az karakterli password verildi.
    await user.type(screen.getByLabelText(/password/i), '123')

    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(
        await screen.findByText(/must be at least 6 character\./i)
    ).toBeInTheDocument()
    expect(axiosInstance.post).not.toHaveBeenCalled()
})

test('long password -> shows max length error and does not call API', async () => {
    renderLogin()

    await user.type(screen.getByLabelText(/username/i), 'admin')
    await user.type(screen.getByLabelText(/password/i), '1234567890123456789')

    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(
        await screen.findByText(/must be at most 10 characters/i)
    ).toBeInTheDocument()

    expect(axiosInstance.post).not.toHaveBeenCalled()
})

//Validasyon hatasının varolup sonra silinip yok olma testi
test('validation error appears on empty submit and disappears after fixing inputs', async () => {
    renderLogin()

    // Formu boş gönderiyorum
    await user.click(screen.getByRole('button', { name: /login/i }))

    //Hatalar gelecek
    const usernameErr = await screen.findByText('Username is required.')
    const passwordErr = await screen.findByText('Password is required.')
    expect(usernameErr).toBeInTheDocument()
    expect(passwordErr).toBeInTheDocument()

    //Validasyona aykırı olan inputlar olması gereken ile değiştirildi
    await user.type(screen.getByLabelText(/username/i), 'admin')
    await user.type(screen.getByLabelText(/password/i), '123456')

    //Değişim async olabilir diye queryBy kullandım safe olmak için
    await waitFor(() => {
        expect(
            screen.queryByText('Username is required.')
        ).not.toBeInTheDocument()
        expect(
            screen.queryByText('Password is required.')
        ).not.toBeInTheDocument()
    })
})

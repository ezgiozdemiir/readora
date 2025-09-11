import Input from '../../components/input/Input'
import { inputTexts } from '../../constants/texts'
import { Alert, Button } from '@mantine/core'
import './Login.scss'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconAlertTriangle } from '@tabler/icons-react'
import axiosInstance from '../../axiosInstance'
import axios from 'axios'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '../../hooks/useAuth'
import { useUser } from '../../contexts/UserContext'

//REACT-HOOK-FORM (https://react-hook-form.com/get-started)
//Controller UI Library componentleri ile kolay çalışmayı sağlıyor.
type LoginFormInputs = {
    username: string
    password: string
}

//YUP VALIDATION
export const Login: React.FC = () => {
    const loginSchema = yup.object({
        username: yup.string().required('Username is required.'),
        password: yup
            .string()
            .min(6, 'Must be at least 6 character.')
            .max(10)
            .required('Password is required.'),
    })

    const [error, setError] = useState('')
    const navigate = useNavigate()
    //Context çağırıldı
    const { setUser } = useUser()

    //CUSTOM HOOK kullanımı
    const { saveAuth } = useAuth()

    //REACT-HOOK-FORM
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({ resolver: yupResolver(loginSchema) })

    const onSubmit: SubmitHandler<LoginFormInputs> = async ({
        username,
        password,
    }) => {
        setError('')
        try {
            const res = await axiosInstance.post('/login', {
                username: username.trim(),
                password: password.trim(),
            })

            const { accessToken, refreshToken, user } = res.data
            saveAuth({ accessToken, refreshToken, user })
            setUser(user)
            navigate('/books')
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const msg = (e.response?.data as any)?.error || 'Login failed'
                setError(msg)
            } else {
                setError('Unknown error occurred!')
            }
        }
    }

    return (
        <div className="inputs">
            <h2>Login</h2>
            {error === 'Username or password' && (
                <Alert
                    data-testid="login-error"
                    variant="light"
                    color="red"
                    radius="md"
                    title="Username or password is incorrect!"
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

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input">
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="text"
                                placeholder={inputTexts.username.placeholder}
                                value={field.value ?? ''}
                                description={inputTexts.username.description}
                                label={inputTexts.username.label}
                            />
                        )}
                    />
                    {errors.username && <p>{errors.username.message}</p>}
                </div>

                <div className="input">
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="password"
                                placeholder={inputTexts.password.placeholder}
                                value={field.value ?? ''}
                                description={inputTexts.password.description}
                                label={inputTexts.password.label}
                            />
                        )}
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>

                <div className="submit">
                    <Button
                        type="submit"
                        variant="filled"
                        size="md"
                        radius="md"
                    >
                        Login
                    </Button>
                </div>
            </form>
        </div>
    )
}

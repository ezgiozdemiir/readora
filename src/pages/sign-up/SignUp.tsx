import Input from '../../components/input/Input'
import { inputTexts } from '../../constants/texts'
import { Button } from '@mantine/core'
import { useState } from 'react'
import * as yup from 'yup'
import { useUser } from '../../hooks/useUser'
import { useAuth } from '../../hooks/useAuth'
import axios from 'axios'
import axiosInstance from '../../axiosInstance'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Toast } from '../../components/toast/Toast'
import clsx from 'clsx'
import { useLoginSubmit } from '../../hooks/useLoginSubmit'

type SignUpFormInputs = {
    username: string
    password: string
}

export const SignUp: React.FC = () => {
    const signUpSchema = yup.object({
        username: yup.string().required('Username is required.'),
        password: yup
            .string()
            .min(6, 'Must be at least 6 character.')
            .max(10, 'Must be at most 10 characters.')
            .required('Password is required.'),
    })

    const [errorRegister, setErrorRegister] = useState('')
    const { login, error, setError } = useLoginSubmit()
    const { setUser } = useUser()
    const { saveAuth } = useAuth()

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormInputs>({ resolver: yupResolver(signUpSchema) })

    const onSubmit: SubmitHandler<SignUpFormInputs> = async ({
        username,
        password,
    }) => {
        setErrorRegister('')
        try {
            const res = await axiosInstance.post('/register', {
                username: username.trim().toLowerCase(),
                password: password.trim(),
            })

            const { accessToken, refreshToken, user } = res.data
            saveAuth({ accessToken, refreshToken, user })
            setUser(user)
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const msg =
                    (e.response?.data as any)?.error || 'Failed to create user'
                setErrorRegister(msg)
            } else {
                setErrorRegister('Unknown error occurred!')
            }
            return
        }

        await login({ username, password, redirectTo: '/books' })
    }

    return (
        <div className="inputs">
            <h2>Create an Account</h2>
            <div className={clsx('toast', errorRegister && 'show')}>
                {errorRegister && (
                    <Toast
                        title={errorRegister}
                        onClose={() => setError('')}
                        data-testid="signup-error"
                    >
                        <>
                            Please try again later or{' '}
                            <a
                                href="/login"
                                style={{ textDecoration: 'underline' }}
                            >
                                go to login page
                            </a>
                            .
                        </>
                    </Toast>
                )}
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input">
                    <Controller
                        name="username"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                type="text"
                                placeholder={inputTexts.username.placeholder}
                                value={field.value ?? ''}
                                description={inputTexts.username.description}
                                label={inputTexts.username.label}
                                error={fieldState.error?.message || undefined}
                            />
                        )}
                    />
                </div>

                <div className="input">
                    <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                type="password"
                                placeholder={inputTexts.password.placeholder}
                                value={field.value ?? ''}
                                description={inputTexts.password.description}
                                label={inputTexts.password.label}
                                error={fieldState.error?.message || undefined}
                            />
                        )}
                    />
                </div>

                <div className="submit">
                    <Button
                        type="submit"
                        variant="filled"
                        size="md"
                        radius="md"
                    >
                        Create account
                    </Button>
                </div>
            </form>
        </div>
    )
}

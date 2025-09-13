import Input from '../../components/input/Input'
import { inputTexts } from '../../constants/texts'
import { Button } from '@mantine/core'
import './Login.scss'
import { useLoginSubmit } from '../../hooks/useLoginSubmit'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Toast } from '../../components/toast/Toast'
import clsx from 'clsx'

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

    //CUSTOM HOOK kullanımı
    const { login, error, setError } = useLoginSubmit()

    //REACT-HOOK-FORM
    const { control, handleSubmit } = useForm<LoginFormInputs>({
        resolver: yupResolver(loginSchema),
    })

    const onSubmit: SubmitHandler<LoginFormInputs> = async ({
        username,
        password,
    }) => {
        await login({ username, password, redirectTo: '/books' })
    }

    return (
        <div className="inputs">
            <h2>Login</h2>
            <div className={clsx('toast', error && 'show')}>
                {error && (
                    <Toast
                        title="Username or password is incorrect!"
                        onClose={() => setError('')}
                        data-testid="login-error"
                        children={
                            <>
                                Please check your credentials or{' '}
                                <a
                                    href="/sign-up"
                                    style={{ textDecoration: 'underline' }}
                                >
                                    create an account
                                </a>
                                .
                            </>
                        }
                    />
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
                        Login
                    </Button>
                </div>
            </form>
        </div>
    )
}

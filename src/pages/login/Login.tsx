import Input from '../../components/input/Input'
import { inputTexts } from '../../constants/texts'
import { Button } from '@mantine/core'
import './Login.scss'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Login: React.FC = () => {
    const fields: (keyof typeof inputTexts)[] = ['email', 'password']
    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async () => {
        const email = formValues.email.trim().toLowerCase()
        const password = formValues.password.trim()

        const res = await fetch(`http://localhost:3001/users?email=${email}`)
        const users = await res.json()
        const user = users[0]

        if (user && user.password === password) {
            localStorage.setItem('user', JSON.stringify(user))
            setError('')
            navigate('/')
        } else {
            setError('Invalid email or password')
        }
    }

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        fieldName: keyof typeof inputTexts
    ) => {
        setFormValues((prev) => ({
            ...prev,
            [fieldName]: event.target.value,
        }))
    }

    return (
        <div className="inputs">
            {fields.map((field) => (
                <div className="input" key={field}>
                    <Input
                        placeholder={inputTexts[field].placeholder}
                        description={inputTexts[field].description}
                        label={inputTexts[field].label}
                        value={formValues[field]}
                        onChange={(e) => handleChange(e, field)}
                    />
                </div>
            ))}
            <div className='error'>
             {error && <div>{error}</div>}                
            </div>
            <div className="submit">
                <Button
                    variant="filled"
                    size="md"
                    radius="md"
                    onClick={handleLogin}
                >
                    Login
                </Button>
            </div>
        </div>
    )
}

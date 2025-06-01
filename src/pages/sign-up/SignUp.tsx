import Input from '../../components/input/Input'
import { inputTexts } from '../../constants/texts'
import { Button, Modal, Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const SignUp: React.FC = () => {
    const fields: (keyof typeof inputTexts)[] = ['email', 'password']
    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [modalOpened, setModalOpened] = useState(false)

    useEffect(() => {
        if(modalOpened){
            const timeout = setTimeout(()=> {
                setModalOpened(false)
                navigate('/login')
        },5000)
        return () => clearTimeout(timeout)}
    },[modalOpened, navigate])

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        fieldName: keyof typeof inputTexts
    ) => {
        setFormValues((prev) => ({
            ...prev,
            [fieldName]: event.target.value,
        }))
    }

    const handleSignUp = async () => {
        const email = formValues.email.trim().toLowerCase();
        const password = formValues.password.trim();

        const res = await fetch(`http://localhost:3001/users?email=${email}`)
        const users = await res.json();

        if(users.length > 0){
            setError('User with this email already exists')
             setModalOpened(true)
            return
        }

        const newUser = {email, password}

        const createRes = await fetch(`http://localhost:3001/users`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(newUser),
        })

        
        if (createRes.ok) {
            const createdUser = await createRes.json()
            localStorage.setItem('user', JSON.stringify(createdUser))
            setError('')
            navigate('/')
        } else {
            setError('Failed to create user')
        }
    }
    return (
        <div className="inputs">
            <h2>Create an Account</h2>
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
                    onClick={handleSignUp}
                >
                    Login
                </Button>
            </div>
             <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Email Already Exists"
                centered
            >
                <Text color="red" size="sm">
                    This email address is already registered.<br />
                    Redirecting to login page in 5 seconds...
                </Text>
            </Modal>
        </div>
    )
}

import { Button, Title, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

export const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '10%' }}>
            <Title order={1}>404</Title>
            <Text size="lg" mt="md">
                Oops! The page you’re looking for doesn’t exist.
            </Text>
            <Button component={Link} to="/login" mt="xl">
                Go to Login
            </Button>
        </div>
    )
}

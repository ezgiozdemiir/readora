import { PasswordInput, type PasswordInputProps } from '@mantine/core'

type Props = PasswordInputProps

export default function Input(props: Props) {
    return <PasswordInput radius="xl" withAsterisk {...props} />
}

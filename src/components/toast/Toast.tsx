import { Notification, NotificationProps } from '@mantine/core'

export type ToastProps = NotificationProps

export function Toast({ title, children, ...props }: ToastProps) {
    return (
        <Notification
            withBorder
            color="violet"
            radius="md"
            title={title}
            {...props}
        >
            {children}
        </Notification>
    )
}

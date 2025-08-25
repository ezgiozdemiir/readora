import { redirect } from 'react-router-dom'
import axios from 'axios'
import { axiosInstance } from '../axiosInstance'
import type { BookCategoryList } from '../types/types'

export async function bookOverviewLoader() {
    try {
        const res = await axiosInstance.get<{ lists: BookCategoryList[] }>(
            '/books'
        )
        return res.data
    } catch (e) {
        if (axios.isAxiosError(e)) {
            const status = e.response?.status
            if (status === 401 || status === 403) {
                throw redirect('/login')
            }
            const message =
                (e.response?.data as any)?.error ??
                e.message ??
                'Failed to load books'
            throw new Response(message, {
                status: status ?? 500,
                statusText: message,
            })
        }
        throw new Response('Unknown error occurred!', { status: 500 })
    }
}

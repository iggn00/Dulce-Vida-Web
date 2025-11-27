import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/AuthContext.jsx'

function Consumer() {
    const { isAuthenticated } = useAuth()
    return <span>{isAuthenticated ? 'AUTH' : 'NOAUTH'}</span>
}

describe('AuthProvider refresh logic', () => {
    it('starts unauthenticated without token', async () => {
        render(
            <AuthProvider>
                <Consumer />
            </AuthProvider>
        )

        await waitFor(() => {
            expect(screen.getByText('NOAUTH')).toBeInTheDocument()
        })
    })
})
import { render, screen } from '@testing-library/react';
import { useAuthStore } from '../../src/hooks';
import { AppRouter } from '../../src/router/AppRouter';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../src/hooks/useAuthStore');

jest.mock('../../src/calendar', () => ({
    CalendarPage: () => <h1>CalendarPage</h1>
}));

describe('tests for <AppRouter />', () => {

    const mockCheckAuthToken = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    test('should display loading screen and call checkAuthToken', () => {

        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockCheckAuthToken
        });

        render(<AppRouter />);

        expect(screen.getByText('Loading...')).toBeTruthy();
        expect(mockCheckAuthToken).toHaveBeenCalled();

    });

    test('should display login if not authenticated', () => {

        useAuthStore.mockReturnValue({
            status: 'not-authenticated',
            checkAuthToken: mockCheckAuthToken
        });

        const { container } = render(
            <MemoryRouter>
                <AppRouter />
            </MemoryRouter>
        );

        expect(screen.getByText('Login')).toBeTruthy();
        expect(container).toMatchSnapshot();

    });

    test('should display calendar if authenticated', () => {

        useAuthStore.mockReturnValue({
            status: 'authenticated',
            checkAuthToken: mockCheckAuthToken
        });

        render(
            <MemoryRouter>
                <AppRouter />
            </MemoryRouter>
        );

        expect(screen.getByText('CalendarPage')).toBeTruthy();

    });

});

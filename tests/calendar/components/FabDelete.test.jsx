import { fireEvent, render, screen } from '@testing-library/react';
import { FabDelete } from '../../../src/calendar/components/FabDelete';
import { useCalendarStore } from '../../../src/hooks';

jest.mock('../../../src/hooks/useCalendarStore');

describe('tests for <FabDelete />', () => {

    const mockStartDeletingEvent = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    test('should render correctly', () => {

        useCalendarStore.mockReturnValue({
            hasEventSelected: false
        });

        render(<FabDelete />);

        const btn = screen.getByLabelText('btn-delete');
        expect(btn.classList).toContain('btn');
        expect(btn.classList).toContain('btn-danger');
        expect(btn.classList).toContain('fab-danger');
        expect(btn.style.display).toBe('none');

    });

    test('should render if there is an active event', () => {

        useCalendarStore.mockReturnValue({
            hasEventSelected: true
        });

        render(<FabDelete />);

        const btn = screen.getByLabelText('btn-delete');
        expect(btn.style.display).toBe('');

    });

    test('should call startDeletingEvent if there is an active event', () => {

        useCalendarStore.mockReturnValue({
            hasEventSelected: true,
            startDeletingEvent: mockStartDeletingEvent
        });

        render(<FabDelete />);

        const btn = screen.getByLabelText('btn-delete');
        fireEvent.click(btn);

        expect(mockStartDeletingEvent).toHaveBeenCalled();

    });

});

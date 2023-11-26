import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from '../../../src/store/calendar/calendarSlice';
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from '../../fixtures/calendarStates';

describe('tests for calendarSlice', () => { 
    
    test('should return default state', () => { 
        
       const state = calendarSlice.getInitialState();
       expect( state ).toEqual( initialState ); 
        
    });
    
    test('onSetActiveEvent should activate the event', () => { 
        
        const state = calendarSlice.reducer( calendarWithActiveEventState, onSetActiveEvent( events[0]) );
        expect(state.activeEvent).toEqual( events[0] );
        
    });
    
    test('onAddNewEvent should add the event', () => { 
        
        const newEvent = {
            id: '3',
            start: new Date('2023-11-25 13:00:00'),
            end: new Date('2023-11-25 15:00:00'),
            title: 'Cumpleaños de Fernando',
            notes: 'Alguna nota',
        }
        
        const state = calendarSlice.reducer( calendarWithActiveEventState, onAddNewEvent( newEvent ) );
        expect(state.events).toEqual([ ...events, newEvent ]);
        
    });
    
    test('onUpdateEvent should update the event', () => { 
        
        const updatedEvent = {
            id: '1',
            start: new Date('2023-11-25 13:00:00'),
            end: new Date('2023-11-25 15:00:00'),
            title: 'Cumpleaños de Fernando Actualizado',
            notes: 'Alguna nota actualizada',
        }
        
        const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updatedEvent ) );
        expect( state.events ).toContain( updatedEvent );
        
    });
    
    test('onDeleteEvent should delete the event', () => { 
        
        const state = calendarSlice.reducer( calendarWithActiveEventState, onDeleteEvent() );
        expect( state.activeEvent ).toBe( null );
        expect( state.events ).not.toContain( events[0] );
        
    });
    
    test('onLoadEents should load the events', () => { 
        
        const state = calendarSlice.reducer( initialState, onLoadEvents( events ) );
        expect( state.isLoadingEvents ).toBeFalsy();
        expect( state.events ).toEqual( events );
        
        const newState = calendarSlice.reducer( state, onLoadEvents( events ) );
        expect( state.events.length ).toBe( events.length );
        
    });
    
    test('onLogoutCalendar should clean the state', () => { 
        
        const state = calendarSlice.reducer( calendarWithActiveEventState, onLogoutCalendar() );
        expect( state ).toEqual(initialState);
        
    });
    
 })

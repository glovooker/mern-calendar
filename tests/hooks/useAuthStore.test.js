import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { authSlice } from '../../src/store';
import { initialState, notAuthenticatedState } from '../fixtures/authStates';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { testUserCredentials } from '../fixtures/testUser';
import calendarApi from '../../src/api/calendarApi';

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
        },
        preloadedState: {
            auth: { ...initialState },
        }
    });
}

describe('tests for useAuthStore', () => { 
    
    beforeEach(() => localStorage.clear());
    
    test('should return default values', () => { 
        
        const mockStore = getMockStore({ ...initialState })
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>,
        });
        
        expect(result.current).toEqual({
            errorMessage: undefined,
            status: 'checking',
            user: {},
            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),
        });
    });
    
    test('startLogin should login correctly', async() => { 
        
        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>,
        });
        
        await act(async() => {
            await result.current.startLogin( testUserCredentials );
        });
        
        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '6563098d9aae0aecb24bb4c4' }
        });
        
        expect( localStorage.getItem('token') ).toEqual( expect.any(String) );	
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any(String) );
    });
    
    test('startLogin should fail the authentication', async() => { 
        
        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>,
        });
        
        await act(async() => {
            await result.current.startLogin({ email: 'algo@google.com', password: '123456789' });
        });
        
        const { errorMessage, status, user } = result.current;
        expect( localStorage.getItem('token')).toBe(null);
        expect({ errorMessage, status, user }).toEqual({ 
            errorMessage: 'Credentials are not valid', 
            status: 'not-authenticated', 
            user: {}
        });
        
        waitFor(
            () => expect( result.current.errorMessage ).toBe(undefined),
        );
    });
    
    test('startRegister should create an user', async() => { 
        
        const newUser = { email: 'algo@google.com', password: '123456789', name: 'Test User 2' }
        
        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>,
        });
        
        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data: {
                ok: true,
                uid: '6563098d9aae0aecb24bb4c4',
                name: 'Test User 2',
                token: 'ABC123ABC123ABC123'
            }
        });
        
        await act(async() => {
            await result.current.startRegister( newUser);
        });
        
        const { errorMessage, status, user } = result.current;
        
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User 2', uid: '6563098d9aae0aecb24bb4c4' }
        });
        
        spy.mockRestore();
    });
    
    test('startRegister should fail to create an user', async() => { 
        
        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>,
        });
        
        await act(async() => {
            await result.current.startRegister(testUserCredentials);
        });
        
        const { errorMessage, status, user } = result.current;
        
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'An user with that email already exists!',
            status: 'not-authenticated',
            user: {}
        });

    });
    
    test('checkAuthToken should fail if there is no token', async() => { 
        
        const mockStore = getMockStore({ ...initialState })
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>,
        });
        
        await act(async() => {
            await result.current.checkAuthToken();
        });
        
        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        });

    });
    
    test('checkAuthToken should authenticate if there is a token', async() => { 
        
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);
        
        const mockStore = getMockStore({ ...initialState })
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>,
        });
        
        await act(async() => {
            await result.current.checkAuthToken();
        });
        
        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '6563098d9aae0aecb24bb4c4' }
        });

    });
    
 });

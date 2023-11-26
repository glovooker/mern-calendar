import calendarApi from '../../src/api/calendarApi';

describe('Tests for calendarApi', () => {
    
    test('should have default configuration', () => { 
        expect(calendarApi.defaults.baseURL).toBe( process.env.VITE_API_URL );
    });
     
    test('should have x-token in headers of requests', async() => { 
        
        const token = 'ABC-123-XYZ';
        localStorage.setItem('token', token);
        const res = await calendarApi.get('/auth');
        
        expect(res.config.headers['x-token']).toBe(token);
        
    });
    
});

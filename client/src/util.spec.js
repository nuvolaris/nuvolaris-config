
import {base, get, post, put, del} from './util.ts'

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ prova: 42  }),
    })
);

describe('testing get function', () => {         
    
    it('get con un url specificato', async () => {
        
        const response = await get('/user/1')
        expect(global.fetch).toHaveBeenCalledWith(base+'/user/1')
        expect(response.prova).toBe(42)
    })
    
})
describe('testing post function', () => {         
    const data =  {dummy:23}
    it('post dati', async () => {
        
        const response = await post('/user/1', data)

        expect(global.fetch).toHaveBeenCalledWith(base+'/user/1', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(data)
        })
        expect(response.prova).toBe(42)
    })
    
})
describe('testing put function', () => {         
    const data =  {dummy:23}
    it('post dati', async () => {
        
        const response = await put('/user/1', data)

        expect(global.fetch).toHaveBeenCalledWith(base+'/user/1', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify(data)
        })
        expect(response.prova).toBe(42)
    })
    
})

describe('testing del function', () => {         
    const data =  {dummy:23}
    it('post dati', async () => {
        
        const response = await del('/user/1', data)

        expect(global.fetch).toHaveBeenCalledWith(base+'/user/1', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "DELETE",
            body: JSON.stringify(data)
        })
        expect(response.prova).toBe(42)
    })
    
})

import Menu from './Menu.svelte'
import { render } from '@testing-library/svelte'
import { token } from "./state.ts";


const baseurl = location.protocol+"//"+location.host
describe('testing Menu component', () => {  
    it('menu, no token', async () => {
        
        const menu = [
            {
                name:'test a',
                path:'/test-a'
            },
            {
                name:'test b',
                path:'/test-b'
            }
        ]

        const { getAllByText , findAllByText} = render(Menu, {
            target :document.body,
            props:{
                menu: menu,
                title:'test'
            }
        })

        const itemTextA = getAllByText('test a')
        const itemTextB = getAllByText('test b')
        const logout = findAllByText('Esci')

        expect(itemTextA).not.toBe(null)
        itemTextA.forEach((item) => {
            expect(item.href).toBe(baseurl+menu[0].path)
        })
        expect(itemTextB).not.toBe(null)
        itemTextB.forEach((item) => {
            expect(item.href).toBe(baseurl+menu[1].path)
        })
       
        expect(logout.length).toBe(undefined)

    })

    it('menu, with token', async () => {
        token.set('hgshghgjhsghjsghjsgjhsghjs')
        const menu = [
            {
                name:'test a',
                path:'/test-a'
            },
            {
                name:'test b',
                path:'/test-b'
            }
        ]

        const { getAllByText} = render(Menu, {
            target :document.body,
            props:{
                menu: menu,
                title:'test'
            }
        })

        const itemTextA = getAllByText('test a')
        const itemTextB = getAllByText('test b')
        const logout = getAllByText('Esci')

        expect(itemTextA).not.toBe(null)
        expect(itemTextB).not.toBe(null)
        expect(logout).not.toBe(undefined)
        expect(logout.length).toBe(2)

    })
})
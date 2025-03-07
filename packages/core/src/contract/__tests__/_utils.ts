import { initClient } from '@ts-rest/core'
import { celCashRestFetchApi } from '../../utils/api.js'
import { basicAuthorization } from '../../utils/basic.js'
import { auth } from '../auth.js'

export async function authenticate() {
    const client = initClient(auth, {
        baseUrl: 'https://api.sandbox.cel.cash/v2',
        api: celCashRestFetchApi,
        baseHeaders: {},
    })

    const response = await client.token({
        body: {
            grant_type: 'authorization_code',
            scope: [
                'customers.read',
                'customers.write',
                'plans.read',
                'plans.write',
                'transactions.read',
                'transactions.write',
                'cards.read',
                'cards.write',
                'card-brands.read',
                'subscriptions.read',
                'subscriptions.write',
                'charges.read',
                'charges.write',
                'boletos.read',
                'carnes.read',
                'payment-methods.read',
            ],
        },
        headers: {
            authorization: basicAuthorization({
                ID: 5473,
                HASH: '83Mw5u8988Qj6fZqS4Z8K7LzOo1j28S706R0BeFe',
            }),
        },
    })

    if (response.status !== 200) {
        console.error(response.body)
        throw new Error('Error while fetching token')
    }

    return response.body
}

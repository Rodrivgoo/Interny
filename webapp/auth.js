import NextAuth from "next-auth"

import GoogleProvider from "next-auth/providers/google"
import AzureADProvider from "next-auth/providers/azure-ad"
import CredentialsProvider from "next-auth/providers/credentials"

function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}


export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Add logic to verify credentials here
                if (!credentials) return null
                const { email, password } = credentials

                try {
                    let API_URL = process.env.API_URL
                    if (!API_URL) {
                        console.log('API_URL not found, using default localhost:8000')
                        API_URL = 'http://localhost:8000'
                    }
                    const res = await fetch(API_URL + '/authenticate/login/', {
                        method: 'POST',
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                            provider: 'credentials',
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    })

                    if (!res.ok) {
                        console.log('ERROR LOGGIN IN WITH CREDENTIALS')
                        return {
                            error: "Invalid credentials"
                        }
                    }

                    const parsedRes = await res.json()
                    const access_token = parsedRes.access
                    if (!access_token) {
                        return {
                            error: "Invalid credentials"
                        }
                    }


                    let parsedToken = parseJwt(access_token)

                    const role = parsedToken.role
                    const userId = parsedToken.user_id
                    const firstName = parsedToken.first_name
                    const lastName = parsedToken.last_name
                    const career = parsedToken?.career_name || ""
                    // console.log('ROLE: ', role)

                    if (!access_token || !role) {
                        return {
                            error: "Invalid credentials"
                        }
                    }

                    if (role === 'student') {
                        const selectedCareerId = '1234'
                        return {
                            ...credentials,
                            access_token,
                            firstName,
                            lastName,
                            userId,
                            role,
                            selectedCareerId
                        }
                    }

                    return {
                        ...credentials,
                        access_token,
                        firstName,
                        lastName,
                        userId,
                        role,
                    }

                } catch (error) {
                    throw new Error('Error in request')
                }
            },
        }),
    ],
    skipCSRFCheck: true,
    callbacks: {
        async signIn({ user, profile, account }) {
            // console.log('------------ SIGN IN ------------')
            // console.log('ACCOUNT', account) //account.id_token
            // console.log('USER', user)
            // console.log('PROFILE', profile)

            if (user?.error) {
                return false
            }


            let API_URL = process.env.API_URL
            if (!API_URL) {
                console.log('API_URL not found, using default localhost:8000')
                API_URL = 'http://localhost:8000'
            }
            // console.log('SIGN IN')
            // console.log('USER: ', user)
            // console.log('ACCOUNT', account)
            if (account.provider === 'google' || account.provider === 'azure-ad') {
                // console.log('Loggin in with: ')
                // console.log('email: ', user.email)
                // console.log('provider: ', account.provider)
                // console.log('providerToken: ', account.id_token)

                let API_PROVIDER = ''
                if (account.provider === 'google') {
                    API_PROVIDER = '/authenticate/verify-google-token/'
                }

                // console.log('MAKING POST TO: ', API_URL + API_PROVIDER)
                const res = await fetch(API_URL + API_PROVIDER, {
                    method: 'POST',
                    body: JSON.stringify({
                        token: account.id_token
                    }),
                    headers: { 'Content-Type': 'application/json' }
                })

                // TODO: check if there is data in the response
                if (!res.ok) {
                    console.log('ERROR LOGGIN IN WITH GOOGLE', res.status)
                    return false
                }

                const parsedRes = await res.json()
                const access_token = parsedRes.access
                if (!access_token) {
                    return {
                        error: "Invalid credentials"
                    }
                }

                let parsedToken = parseJwt(access_token)

                const role = parsedToken.role
                const userId = parsedToken.user_id
                user.access_token = access_token
                user.role = role
                user.userId = userId


                return true

            }

            return true
        },
        async jwt({ token, user, account }) {
            // console.log('------------- TOKEN -------------')
            // console.log('JWT')
            // console.log('TOKEN: ', token)
            // console.log('USER: ', user)
            // console.log('ACCOUNT', account)
            // if (user) {
            //     token.user = user
            // }
            // const accessToken = user?.access_token
            // if (!accessToken) {
            //     console.log('NO ACCESS TOKEN', accessToken)
            //     return token
            // }
            //
            //
            // const parsedToken = parseJwt(accessToken)
            // let expirationDate = new Date(parsedToken.exp * 1000)
            // if (new Date() > expirationDate) {
            //     console.log('TOKEN EXPIRED IN TOKEN')
            //     return token
            // }
            //

            if (user?.firstName) {
                token.firstName = user.firstName
            }
            if (user?.lastName) {
                token.lastName = user.lastName
            }

            if (user?.access_token) {
                token.accessToken = user.access_token
                // token.providerToken = account.id_token
            }
            if (user?.role) {
                token.role = user.role
            }

            if (user?.userId) {
                token.userId = user.userId
            }

            return token
        },
        async session({ session, token, user }) {
            // console.log('------------ SESSION ------------')

            // Here we have to see the expiration date for the token 
            // and return null if it is expired

            // console.log('USER: ', user)
            // console.log('SESSION: ', session)
            // console.log('TOKEN: ', token)

            const accessToken = token.accessToken
            if (!accessToken) {
                return session
            }
            const parsedToken = parseJwt(token.accessToken)
            let expirationDate = new Date(parsedToken.exp * 1000)
            if (new Date() > expirationDate) {
                await signOut()
                return session
            }

            session.accessToken = token.accessToken

            session.role = token.role
            session.user.id = token.userId
            if (token?.firstName != undefined) {
                session.user.name = token?.firstName + ' ' + token?.lastName
            }
            session.firstName = token?.firstName
            session.lastName = token?.lastName

            return session
        }
    },
})

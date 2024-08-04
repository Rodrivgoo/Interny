import { auth, signOut } from "@/auth"
import Link from "next/link"


export default async function Test({ params: { lang } }) {
    // let session 
    const session = await auth()
    if (!session) {
        return (
            <div className="flex flex-col justify-center items-center h-full">
                <p>TEST</p>
                <p>Not logged in</p>
                <Link href="/login"> Login </Link>
            </div>
        )
    }
    console.log('IN TEST:')
    return (
        <div className="flex flex-col justify-center items-center h-full">
            <p>TEST</p>
            {session && <p>user: {session.user.email}</p>}
            <p>access token: {session.accessToken}</p>
            <form action={async () => {
                "use server"
                console.log('SIGN IN')
                await signOut()
            }}>
                <button type='submit'>Sign Out</button>
            </form>
        </div>
    )
}

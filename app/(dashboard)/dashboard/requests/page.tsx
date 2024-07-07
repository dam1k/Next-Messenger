import FriendRequests from '@/components/FriendRequests'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import React from 'react'
import { fetchRedis } from '@/helpers/redis'

const Requests = async () => {
    const session = await getServerSession(authOptions);

    if(!session) notFound();

    const incomingFriendRequestSendersIds:any = await fetchRedis(
        "smembers", 
        `user:${session.user.id}:incoming_friend_requests`,
    ); 

    const incomingFriendRequests = await Promise.all(incomingFriendRequestSendersIds.map(async (id:string) => {
        const sender = await fetchRedis("get", `user:${id}`) as string;
        const senderParsed = JSON.parse(sender);

        return {
            senderEmail: senderParsed.email,    
            senderId: id
        }
    }))

    return (
        <main className='pt-8'>
            <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
            <div className='flex flex-col gap-4'>
                <FriendRequests
                incomingFriendRequests={incomingFriendRequests}
                sessionId={session.user.id}
                />
            </div>
        </main>
    )
}

export default Requests;
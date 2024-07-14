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

    // const userFriends:any = await fetchRedis(
    //     "smembers", 
    //     `user:${session.user.id}:friends`,
    // ); 

    // const userFriendsEmails = await Promise.all(userFriends.map(async (friendId:any) => {
    //     const userFriend = await fetchRedis("get", `user:${friendId}`) as string;
    //     const parsedFriend = JSON.parse(userFriend);

    //     return {
    //         email: parsedFriend.email
    //     }
    // }))

    // console.log(userFriendsEmails);
    // console.log(session.user.email);
    // // console.log(userFriends);

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
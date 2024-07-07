import { authOptions } from "@/lib/auth";
import { addFriendValidator } from "@/lib/validators/addFriendValidator";
import { getServerSession } from "next-auth";
import { fetchRedis } from "@/helpers/redis";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {email: emailToAdd} = addFriendValidator.parse(body.email);

        const idToAdd = await fetchRedis("get", `user:email:${emailToAdd}`) as string;
 
        if(!idToAdd) {
            return new Response("This person does not exist", {status: 400});
        }

        const session = await getServerSession(authOptions);

        if(!session) {
            return new Response("Unauthorized", {status: 401})
        }

        if(idToAdd === session?.user.id) {
            return new Response("You can not add yourself bro", {status: 400})
        }

        //check if user is already added
        const isAlreadyAdded = (await fetchRedis(
            "sismember", 
            `user:${idToAdd}:incoming_friend_requests`, 
            session.user.id
        ));

        if(isAlreadyAdded) {
            return new Response("Friend request already sent", {status: 400})
        }

          // check if user are already friends
        const isAlreadyFriends = (await fetchRedis(
            'sismember',
            `user:${session.user.id}:friends`,
            idToAdd
        )) 

        if(isAlreadyFriends) {
            return new Response("You're already friends", {status: 400})
        }

        //valid request

        await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);
        return new Response("All good", {status: 200})
    } catch(error) {

    }
}
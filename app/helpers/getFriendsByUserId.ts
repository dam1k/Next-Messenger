import { fetchRedis } from "@/helpers/redis";

export const getFriendsByUserId = async (userId: string) => {
    const friendsIds:any = await fetchRedis("smembers", `user:${userId}:friends`);

    const friends = await Promise.all(friendsIds.map(async (friendId:any) => {
        const friend:any = await fetchRedis("get", `user:${friendId}`);
        return JSON.parse(friend) as User;
    }));

    return friends as User[];
}
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation';
import { fetchRedis } from '@/helpers/redis';
import { db } from '@/lib/db';


interface ChatPageProps {
    params: {
        chatId: string;
    }
}

async function getChatMessages(chatId: string) {
    try {
        const results:any = await fetchRedis(
            "zrange",
            `chat:${chatId}:messages`,
            0,
            -1
        ) 
        const parsedMessages = results.map((message:any) => JSON.parse(message) as Message);
        const reservedMessages = parsedMessages.reverse();
        
    } catch(error) {
        notFound();
    }
}

const ChatPage = async ({params}:ChatPageProps) => {
    const session:any = await getServerSession(authOptions);

    if(!session) {
        notFound();
    }

    const {user} = session;
    const {chatId} = params;

    const [userId1, userId2] = chatId.split("--");

    if(user.id !== userId1 && user.id !== userId2) {
        notFound();
    }

    const chatPartnerId = user.id === userId1 ? userId2 : userId1;
    const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;

    const messages = await getChatMessages(chatId);
    
  return (
    <div>{chatId}</div>
  )
}

export default ChatPage
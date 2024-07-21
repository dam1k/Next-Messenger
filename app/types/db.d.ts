interface User {
    name: string;
    email: string;
    image: string;
    id: string;
}

interface Message {
    id: string;
    // receiverId: string;
    senderId: string;
    text: string;
    timestamp: number;
}

interface Chat {
    id: string;
    messages: Message[];
}

interface FriendRequest {
    id: string;
    receiverId: string;
    senderId: string;
}
import React, { useRef, useEffect } from 'react';

const ChatWindow = ({ messages, onDeleteMessage }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
            {messages && messages.length > 0 ? (
                messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`mb-3 p-2 rounded-md ${msg.user === 'You' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300'}`}
                    >
                        <div className="flex justify-between">
                            <p className="font-bold">{msg.user}</p>
                            <button
                                onClick={() => onDeleteMessage(msg._id)}
                                className="text-sm text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </div>
                        <p>{msg.message}</p>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No messages yet</p>
            )}

            <div ref={scrollRef} />
        </div>
    );
};

export default ChatWindow;

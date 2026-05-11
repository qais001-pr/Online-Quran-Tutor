import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, } from "socket.io-client";
import { Socket_URL } from '../../IpConfig'
import { useAuth } from "./auth";
const SocketContext = React.createContext(null)

export const SocketProvider = ({ children }) => {

    const { user } = useAuth()
    const [Socket, setSocket] = useState()
    let connectSocket = useCallback(() => {

        try {

            const newSocket = io(Socket_URL, {
                withCredentials: false,
                autoConnect: true,
                reconnectionAttempts: 10,
                transports: ['websocket']
            });

            setSocket(newSocket);
            newSocket.on('connect', () => {

                console.log("Socket Connected:", newSocket.id);
                newSocket.emit('user-connected', {
                    socketid: newSocket.id,
                    user
                });

            });

        } catch (error) {
            console.log(error);
        }

    }, [user]);
    const getActiveUserList = useCallback((data) => {

        console.log('User Active List:', data);

        // setActiveUsers(data);

    }, []);
    useEffect(() => {

        if (!Socket) return;

        Socket.on('user-connected-list', getActiveUserList);

        return () => {
            Socket.off('user-connected-list', getActiveUserList);
        };

    }, [Socket, getActiveUserList]);
    useEffect(() => {
        connectSocket()
    }, [connectSocket])
    return (
        <SocketContext.Provider value={{ Socket }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext)
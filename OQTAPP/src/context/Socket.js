import React, { useContext, useMemo } from "react";
import { io } from "socket.io-client";
import { Socket_URL } from '../../IpConfig'

const SocketContext = React.createContext(null)

export const SocketProvider = ({ children }) => {

    const Socket = useMemo(() => io(`${Socket_URL}`, {
        transports: ['websocket'],
        reconnectionAttempts: 5,
        autoConnect: false,
        withCredentials: false
    }), [])

    return (
        <SocketContext.Provider value={{ Socket }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext)
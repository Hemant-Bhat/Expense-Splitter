import { createContext, useContext, useState, type ReactNode } from "react";
import { socket as socketInstance } from "../services/socketInstance";
import type { Socket } from "socket.io-client";

type SocketContextType = {
    socket: Socket | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket] = useState<Socket | null>(socketInstance);

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error("useSocketContext should be use inside SocketProvider");
    }

    return context;
};

import type { Socket } from "socket.io-client";

export const registerBalanceEvents = ({
    socket,
    handlers,
}: {
    socket: Socket;
    handlers?: {
        onPayableUpdate?: (data: any) => void;
        onReceivableUpdate?: (data: any) => void;
    };
}) => {
    // console.log("regitering balance events");

    socket.on("payable:updated", (data: any) => {
        // console.log("payable:updated", data);
        handlers?.onPayableUpdate?.(data);
    });

    socket.on("receivable:updated", (data: any) => {
        // console.log("receivable:updated", data);
        handlers?.onReceivableUpdate?.(data);
    });

    return () => {
        socket.off("payable:updated");
        socket.off("receivable:updated");
    };
};

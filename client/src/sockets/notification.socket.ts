import type { Socket } from "socket.io-client";
import type { NotificationEvent } from "./types";

export const registerNotificationEvent = ({
    socket,
    handlers,
}: {
    socket: Socket;
    handlers?: {
        onNotificationUpdate: (value: any) => void;
    };
}) => {
    console.log("registering notification events");

    socket.on<NotificationEvent>("notification:updated", (value) => {
        handlers?.onNotificationUpdate?.(value);
        console.log("value", value);
    });
    return () => {
        socket.off<NotificationEvent>("notification:updated");
    };
};

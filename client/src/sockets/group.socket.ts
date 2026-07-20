import type { Socket } from "socket.io-client";
import { type ExpenseEvent, type MemberEvent } from "./types";

type RegisterGroupEventsParam = {
    socket: Socket;
    groupId: string;
    handlers?: {
        onExpenseAdded?: (value: any) => void;
        onExpenseUpdated?: (value: any) => void;
        onExpenseRemoved?: (value: any) => void;
        onMemberAdded?: (value: any) => void;
        // onMemberUpdated?: (value: any) => void;
        onMemberRemoved?: (value: any) => void;
    };
};
export const joinGroup = (socket: Socket, groupId: string) => {
    socket.emit("join-room", `${groupId}`);
    console.log("Joining room: ", `${groupId}`);
};

export const leaveGroup = (socket: Socket, groupId: string) => {
    socket.emit("leave-room", `${groupId}`);
    console.log("Leaving room: ", `${groupId}`);
};

export const registerGroupEvents = ({ socket, groupId, handlers }: RegisterGroupEventsParam): (() => void) => {
    joinGroup(socket, groupId);

    socket.on<ExpenseEvent>("expense:added", function (value) {
        handlers?.onExpenseAdded?.(value);
    });

    socket.on<ExpenseEvent>("expense:updated", function (value) {
        handlers?.onExpenseUpdated?.(value);
    });

    socket.on<ExpenseEvent>("expense:removed", function (value) {
        handlers?.onExpenseRemoved?.(value);
    });

    socket.on<MemberEvent>("member:added", function (value) {
        handlers?.onMemberAdded?.(value);
    });

    // socket.on<MemberEvent>("member:updated", function (value) {
    //     handlers?.onMemberUpdated?.(value);
    // });

    socket.on<MemberEvent>("member:removed", function (value) {
        handlers?.onMemberRemoved?.(value);
    });

    return function unregister() {
        socket.off("expense:added");
        leaveGroup(socket, groupId);
    };
};

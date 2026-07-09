import { axiosInstanse, type ApiResponse } from "./axiosInstance";

type Members = string[];

type CreateGroup = {
    name: string;
    members?: Members;
};

export const getAllGroups = () => {
    return axiosInstanse.get("/group");
};

export const createGroup = (data: CreateGroup) => {
    return axiosInstanse.post("/group/create", data);
};

export const addMembers = ({ groupId, members }: { groupId: string; members: Members }) => {
    return axiosInstanse.post(`/group/${groupId}/join`, { members });
};

type GroupResponse = {
    name: string;
    id: string;
    members: string[];
    creator: {
        email: string;
        id: string;
    };
    createdAt: Date;
    updatedAt: Date;
};
export const getGroup = (groupId: string) => {
    return axiosInstanse.get<ApiResponse<GroupResponse>>("/group/" + groupId);
};

export const getGroupExpenses = (groupId: string) => {
    return axiosInstanse.get(`/group/${groupId}/expenses`);
};

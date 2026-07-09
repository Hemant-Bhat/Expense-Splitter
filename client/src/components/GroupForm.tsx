import { Form, Input, Modal, Select, type ModalProps } from "antd";
import { useForm, type FormInstance } from "antd/es/form/Form";
import type React from "react";

type GroupForm = {
    name: string;
    members: string[];
};

type GroupFormProps = {
    open: boolean;
    onCancel: ModalProps["onCancel"];
    // onOk: ModalProps["onOk"];
    onOk: (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>, data: FormInstance<GroupForm>) => void;
    groupName?: string;
    title?: string;
    cancelText?: string;
    okText?: string;
    users: { label: string; value: string | number }[];
    onUserSearch?: (value: string) => void;
    // onCancel: (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLElement>) => void;
};

// TO-DO
// | {
//     mode: "ADD_MEMBER";
//     groupName: string;
// };

export const GroupForm: React.FC<GroupFormProps> = ({ open, onCancel, onOk, onUserSearch, users, okText, cancelText, title, groupName }) => {
    const [form] = useForm<GroupForm>();

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // const data = form.getFieldsValue();
        onOk(event, form);
    };

    return (
        <>
            <Modal
                title={title || "Create Group"}
                open={open}
                onCancel={onCancel}
                onOk={handleSubmit}
                okText={okText || "Create"}
                cancelText={cancelText}
            >
                <Form
                    form={form}
                    layout="vertical"
                    fields={[{ name: "name", value: groupName }]}
                >
                    <Form.Item
                        name={"name"}
                        label={"Group Name"}
                    >
                        <Input
                            type={"text"}
                            disabled={!!groupName && groupName?.length > 0}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"members"}
                        label={"Add members"}
                    >
                        <Select
                            mode="multiple"
                            showSearch={{ filterOption: true, onSearch: onUserSearch, optionFilterProp: "label" }}
                            style={{ width: "100%" }}
                            options={users || []}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

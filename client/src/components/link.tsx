// import { createLink } from "@tanstack/react-router";
// import { Button, type ButtonProps } from "antd";
// import type React from "react";
// // export const LinkButton = createLink(Link);

// interface ButtonLinkComponentProps extends ButtonProps {}

// const ButtonLinkComponent: React.FC<ButtonLinkComponentProps> = (props) => {
//     console.log(props);
//     return <Button {...props} />;
// };

// export const LinkButton = createLink(ButtonLinkComponent);

import { useLinkProps, type LinkComponent } from "@tanstack/react-router";
import { Button } from "antd";

export const LinkButton: LinkComponent<typeof Button> = ({ type, ...rest }) => {
    const anchorProps = useLinkProps(rest); // href, onClick, aria-current, etc.
    return (
        <Button
            {...rest}
            type={type}
            {...anchorProps}
        />
    );
};

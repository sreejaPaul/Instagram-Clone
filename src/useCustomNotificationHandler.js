import React, { useCallback, useState } from "react";
import { Alert } from "@material-ui/lab";
import { Snackbar } from "@material-ui/core";

const useCustomNotificationHandler = (
    delay = 4000,
    horizontalAlignment = "center",
    verticalAlignment = "top"
) => {

    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("success");
    const closeMessage = () => setMessage("");

    const CustomNotification = useCallback(() => (
        <>
            <Snackbar
                open={message ? true : false}
                autoHideDuration={delay}
                onClose={closeMessage}
                anchorOrigin={{ vertical: verticalAlignment, horizontal: horizontalAlignment }}
            >
                <Alert severity={messageColor} onClose={closeMessage}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    ), [message, messageColor, verticalAlignment, horizontalAlignment, delay]);

    return { CustomNotification, setMessage, setMessageColor };
};

export default useCustomNotificationHandler;
import React from "react";

export default function FunctionResend() {
const onReSend = () => {
window.open("mailto:examplegmailmail@gmail.com")
};

return (
<div className="mail-sending">
<p>Send mailen på nytt</p>
<p className="p-style">Åpner mail...</p>
<button onClick={onReSend} className="open-email">Åpning av mail"</button>
</div>
);
}
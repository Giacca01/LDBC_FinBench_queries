// Component for the visualization of utility messages
// (errors, loading process, ecc...)
interface MessageProps{
    msgType: string;
    msgText: string;
}

function Message({msgType, msgText} : MessageProps){
    // base style common to all messages
    let baseStyle : string = "px-4 py-3 rounded-lg shadow-md text-center text-white font-medium";

    // message-type-specific style
    let typeStyle : Record<string, string> = {
        info: "bg-blue-600",
        success: "bg-green-600",
        error: "bg-red-600",
        loading: "bg-yellow-600 animate-pulse"
    };

    return (
        <div className={`${baseStyle} ${typeStyle[msgType]} mt-4`}>
            {msgText}
        </div>
    );
}

export default Message;
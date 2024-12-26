export const formatMessageTime = (data) => {
    return new Date(data).toLocaleDateString("en-US",{
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })
}



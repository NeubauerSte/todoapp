const logEvent = (type, message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const styles = {
        info: "color: blue; font-weight: bold;",
        success: "color: green; font-weight: bold;",
        warning: "color: orange; font-weight: bold;",
        error: "color: red; font-weight: bold;"
    };

    console.log(`%c[${timestamp}] ${type.toUpperCase()}: ${message}`, styles[type] || styles.info);
    if (data) console.log("Details:", data);
};

export default logEvent;
export { logEvent };

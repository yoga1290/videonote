export default Logger;

function Logger(prefix) {

    return {
        log,
    };

    function log(...str) {
        console.log(prefix, str);
    }
}
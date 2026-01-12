export default Util();

function Util() {

    return {
        waitForElement
    };

    function waitForElement(elSelector, currentDocument=window.document) {

        return new Promise((resolve, reject) => {

            let retryCounter = 20;
            function check() {
                
                let el = currentDocument.querySelectorAll(elSelector);
                let exists = el.length > 0;
                let retry = retryCounter > 0 && (!exists);
                if (exists) {
                    resolve();
                } else if (retry) {
                    setTimeout(check, 500); //10000
                    retryCounter--;
                } else {
                    reject();
                }
            }

            check();

        });
    }
}
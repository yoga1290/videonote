export default StorageService();

function StorageService() {

    const COL_TEXT = 'Text';
    const COL_URL = 'URL';
    const COL_START_TIME = 'Start time';
    const COL_END_TIME = 'End time';
    const COL_PLATFORM_VIDEO_ID = 'Platform#VideoId';
    const COL_START_X = 'Timeline start';
    const COL_END_X = 'Timeline end';
    const COL_ORDER = [COL_TEXT, COL_URL, COL_PLATFORM_VIDEO_ID,
                        COL_START_TIME, COL_END_TIME, COL_START_X, COL_END_X];
    const CSV_SEPERATOR = '", "';

    return {
        onExportClick,
        onImportClick
    };

    function onImportClick() {

        return new Promise((res, rej) => {

            let fileInput = document.createElement('input');
            fileInput.type = 'file';
            window.document.body.appendChild(fileInput);//todo remove
            fileInput.addEventListener("change", () => {
                let processedData = {}; // e.g: { [youtube#videoId1]: [{....}, {...},..] }

                for(let fi =0; fi < fileInput.files.length; fi++) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        processedDataOfCurrentFile(reader, processedData);
                    };
                    reader.readAsText(fileInput.files[fi]);
                }
                browser.storage.local.clear().then(() => (
                    browser.storage.local.set(processedData).then(res, rej)), rej);
            });
            fileInput.click();
        });


        function processedDataOfCurrentFile(fileReader, processedData) {

            let mapCSVColumnsIdxToColumnKey = {}; //e.g: { 0: 'text', 1: 'url',..}
            fileReader.result.split('\n').map((line, lineNum) => {
                    if (lineNum == 0) {
                        mapCSVColumnsIdxToColumnKey = getCSVColumnsIdxToColumnNameMap(line);
                        return; // skip CSV Header line
                    }

                    let item = {};
                    line.split(CSV_SEPERATOR).map((rec, csvColumnIdx) => {
                        const colOrderKey = mapCSVColumnsIdxToColumnKey[csvColumnIdx];
                        rec = rec.replace(/\\"/g, '"').replace(/\\n/g, '\n');
                        rec = rec.substring(1, rec.length);
                        item[colOrderKey] = rec;
                    });
                    const platformVideoId = item[COL_PLATFORM_VIDEO_ID];
                    const hasValidPlatformVideoId = platformVideoId != undefined;
                    const hasPlatformVideoId = hasValidPlatformVideoId && !!processedData[platformVideoId];
                    if (hasPlatformVideoId) {
                        processedData[platformVideoId].push(item);
                    } else if(hasValidPlatformVideoId) {
                        processedData[platformVideoId] = [item];
                    }
                });
        }

        function getCSVColumnsIdxToColumnNameMap(csvHeaderLine) {
            //return e.g: { 0: 'text', 1: 'url',..}
            const csvCols = csvHeaderLine.split(',');
            let ret = {};
            csvCols.map((csvColName, idx) => {
                COL_ORDER.map((colName) => {
                    if ( (''+csvColName).indexOf(colName) >= 0) {
                        ret[idx] = colName;
                    }
                });
            });
            return ret;
        }
    }


    function mapObjectArToCSVLine(dataArray) {

        return '"' + COL_ORDER.join(CSV_SEPERATOR) + '"\n'
                    + dataArray.map(rec => (
                        '"' +
                        COL_ORDER.map(colKey => (
                            !!!rec[colKey]? ' ':
                            ( rec[colKey] + '').replace(/\"/g, '\\"') )).join(CSV_SEPERATOR) +
                        '"'
                        ))
                .join('\n') + '\n';
    }

    function onExportClick() {
        browser.storage.local.get(null).then((data) => {
            if(Object.keys(data).length == 0) return;

            let allData = [];
            Object.keys(data).map( (videoIdKey) => {
                allData = [...allData, ...data[videoIdKey]];
            });
            const dataToFile = mapObjectArToCSVLine(allData);
            downloadAsTextFile(dataToFile, `vnotes-${new Date().getTime()}.csv`); 
        });
    }

    function downloadAsTextFile(dataString, filename) {

        let uri = `data:text/plain;base64,${ utf8ToBase64(dataString)}`;
        var link = document.createElement("a");
        link.download = filename;
        link.href = uri;
        link.click();

        function utf8ToBase64(str) {
            // Encode the string to a Uint8Array using UTF-8
            const utf8Bytes = new TextEncoder().encode(str);
            // Convert the bytes to a Base64 string
            const base64String = btoa(String.fromCharCode.apply(null, utf8Bytes));
            return base64String;
        }
    }
}
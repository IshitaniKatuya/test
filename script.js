async function main() {
    // バーコードリーダーイニシャル
    Quagga.init({
        locate: true,
        inputStream: {
            name: "Live",
            type: "LiveStream",
            constraints: {
                width: 640,
                height: 480,
            },
            target: document.querySelector('#barcode-scanner'),
        },
        decoder: {
            readers: ["ean_reader", "ean_8_reader"],
            multiple: false
        },
        locator: {
            halfSample: false,
            patchSize: "medium"
        }
    }, function (err) {
        if (err) {
            console.log(err);
            return;
        }

        //バーコードをスキャンできた際のイベント
        Quagga.onDetected((data) => { alert(data.codeResult.code) });

        Quagga.start();
    });
}
main()

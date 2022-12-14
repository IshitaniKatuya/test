async function main() {
  // バーコードリーダーイニシャル
  Quagga.init({
      locate: true,
      inputStream: {
          name: "Live",
          type: "LiveStream",
          constraints: {
              width: 640,
              height: 100,
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
      Quagga.onDetected((data) => { 
        
        var elem = document.getElementById("barcode");
        elem.textContent = data.codeResult.code;
      });

      Quagga.start();
  });
}
main()

var DetectedCount=0,DetectedCode="";
var video,tmp,tmp_ctx,jan,prev,prev_ctx,w,h,mw,mh,x1,y1;
window.addEventListener('load',function(event){
  video=document.createElement('video');
  video.setAttribute("autoplay","");
  video.setAttribute("muted","");
  video.setAttribute("playsinline","");
  video.onloadedmetadata = function(e){video.play();};
  prev=document.getElementById("preview");
  prev_ctx=prev.getContext("2d");
  tmp = document.createElement('canvas');
  tmp_ctx = tmp.getContext("2d");
  jan=document.getElementById("jan");

  //カメラ使用の許可ダイアログが表示される
  navigator.mediaDevices.getUserMedia(
    //マイクはオフ, カメラの設定   背面カメラを希望する 640×480を希望する
    {"audio":false,"video":{"facingMode":"environment","width":{"ideal":640},"height":{"ideal":480}}}
  ).then( //許可された場合
    function(stream){
      video.srcObject = stream;
      //0.5秒毎にスキャンする
      setTimeout(Scan,500,true);
    }
  ).catch( //許可されなかった場合
    function(err){jan.value+=err+'\n';}
  );

  function Scan(first){
    if(first){
      //選択された幅高さ
      w=video.videoWidth;
      h=video.videoHeight;
      //画面上の表示サイズ
      prev.style.width=(w/2)+"px";
      prev.style.height=(h/2)+"px";
      //内部のサイズ
      prev.setAttribute("width",w);
      prev.setAttribute("height",h);
      mw=w*0.5;
      mh=w*0.2;
      x1=(w-mw)/2;
      y1=(h-mh)/2;
    }
    prev_ctx.drawImage(video,0,0,w,h);
    prev_ctx.beginPath();
    prev_ctx.strokeStyle="rgb(255,0,0)";
    prev_ctx.lineWidth=2;
    prev_ctx.rect(x1,y1,mw,mh);
    prev_ctx.stroke();
    tmp.setAttribute("width",mw);
    tmp.setAttribute("height",mh);
    tmp_ctx.drawImage(prev,x1,y1,mw,mh,0,0,mw,mh);
    
    
    tmp.toBlob(function(blob){
      let reader = new FileReader();
      reader.onload=function(){
        let config={
          decoder: {
            readers: ["ean_reader","ean_8_reader"],
            multiple: false, //同時に複数のバーコードを解析しない
          },
          locator:{patchSize:"large",halfSample:false},
          locate:false,
          src:reader.result,
        };
        Quagga.decodeSingle(config,function(){});
      }
      reader.readAsDataURL(blob);
    });
    setTimeout(Scan,50,false);
  }
  
  Quagga.onProcessed(function (result) {
   	  console.log(result);
      if(result.length == 0) {
        
        var outputMessage = document.getElementById("outputMessage");
        var outputData = document.getElementById("outputData");
        var imageData = tmp_ctx.getImageData(0, 0, tmp.width, tmp.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
          outputMessage.hidden = true;
          outputData.parentElement.hidden = false;
          outputData.innerText = code.data;
        } else {
          outputMessage.hidden = false;
          outputData.parentElement.hidden = true;
        }
        
      }
  });

  Quagga.onDetected(function (result) {
    //読み取り誤差が多いため、3回連続で同じ値だった場合に成功とする
    
    DetectedCode=result.codeResult.code;
    jan.value+=result.codeResult.code+'\n';
    jan.scrollTop=jan.scrollHeight;
    DetectedCode='';
      
  });
});
//     var canvasElement = document.getElementById("canvas");
//     var canvas = canvasElement.getContext("2d");
//     var loadingMessage = document.getElementById("loadingMessage");
//     var outputContainer = document.getElementById("output");
//     var outputMessage = document.getElementById("outputMessage");
//     var outputData = document.getElementById("outputData");

    function drawLine(begin, end, color) {
      prev_ctx.beginPath();
      prev_ctx.moveTo(begin.x, begin.y);
      prev_ctx.lineTo(end.x, end.y);
      prev_ctx.lineWidth = 4;
      prev_ctx.strokeStyle = color;
      prev_ctx.stroke();
    }

//     // Use facingMode: environment to attemt to get the front camera on phones
//     navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
//       video.srcObject = stream;
//       video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
//       video.play();
//       requestAnimationFrame(tick);
//     });

//     function tick() {
//       loadingMessage.innerText = "⌛ Loading video..."
//       if (video.readyState === video.HAVE_ENOUGH_DATA) {
//         loadingMessage.hidden = true;
//         canvasElement.hidden = false;
//         outputContainer.hidden = false;

//         canvasElement.height = video.videoHeight;
//         canvasElement.width = video.videoWidth;
//         canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
//         var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
          // var code = jsQR(imageData.data, imageData.width, imageData.height, {
          //   inversionAttempts: "dontInvert",
          // });
//         if (code) {
//           drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
//           drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
//           drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
//           drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
//           outputMessage.hidden = true;
//           outputData.parentElement.hidden = false;
//           outputData.innerText = code.data;
//         } else {
//           outputMessage.hidden = false;
//           outputData.parentElement.hidden = true;
//         }
//       }
//       requestAnimationFrame(tick);
//     }

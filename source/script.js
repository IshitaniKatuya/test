async function main () {
    try {
      const video = document.querySelector('#video') // <1>
      const button = document.querySelector('#button')
      const image = document.querySelector('#image')
  
      const stream = await navigator.mediaDevices.getUserMedia({ // <2>
        video: {
          facingMode: 'environment',
          // facingMode: 'environment',
        },
        audio: false,
      })
  
      video.srcObject = stream // <3>
  
      const [track] = stream.getVideoTracks()
      const settings = track.getSettings()
      const {width, height} = settings // <4>
  
      button.addEventListener('click', event => { // <5>
        const canvas = document.createElement('canvas') // <6>
        canvas.setAttribute('width', width)
        canvas.setAttribute('height', height)
  
        const context = canvas.getContext('2d')
        context.drawImage(video, 0, 0, width, height) // <7>
  
        const dataUrl = canvas.toDataURL('image/jpeg') // <8>
        image.setAttribute('src', dataUrl) // <9>
      })
    } catch (err) {
      console.error(err)
    }
  }
  
  main()
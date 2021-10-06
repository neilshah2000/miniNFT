// https://stackoverflow.com/questions/14672746/how-to-compress-an-image-via-javascript-in-the-browser


function getArt() {
    return fetch('NFT-non-fungible-token.2-810x524.jpg')
        .then(response => response.blob())
    // return fetch('small.png')
    //     .then(response => response.blob())
}

function getArtUrl() {
    return getArt().then(imageBlob => {
        const imageObjectURL = URL.createObjectURL(imageBlob);
        console.log(imageObjectURL);
        return imageObjectURL
    });
}

// <img src="NFT-non-fungible-token.2-810x524.jpg">
function displayArt() {
    getArtUrl().then(imageUrl => {
        let imageNode = document.createElement('img')
        imageNode.src = imageUrl
        const div = document.getElementById('imageDiv')
        div.appendChild(imageNode)
        console.log('load and display image with javascript')
    })
}


function getArtBinaryString() {
    return new Promise((resolve, reject) => {
        getArt().then((imageBlob) => {
            var reader = new FileReader();
    
            reader.onload = function () {
                console.log(reader.result);
                resolve(reader.result)
            }
    
            reader.readAsBinaryString(imageBlob);
        })
    })
}

function getArtArrayBuffer() {
    return new Promise((resolve, reject) => {
        getArt().then((imageBlob) => {
            var reader = new FileReader();
    
            reader.onload = function () {
                console.log(reader.result);
                resolve(reader.result)
            }
    
            reader. readAsArrayBuffer(imageBlob);
        })
    })
}


function getArtDataUrl() {
    return new Promise((resolve, reject) => {
        getArt().then((imageBlob) => {
            var reader = new FileReader();
    
            reader.onload = function () {
                console.log(reader.result);
                resolve(reader.result)
            }
    
            reader.readAsDataURL(imageBlob);
        })
    })
}


function getArtFullConversionProcess() {
    // get blob
    // convert to binary string
    // convert back to blob
    // convert blob to data url
    return new Promise((resolve, reject) => {
        getArtArrayBuffer().then(ab => {
            const blob = new Blob([ab], {type : 'image/jpeg'});
            var reader = new FileReader();
        
            reader.onload = function () {
                console.log(reader.result);
                resolve(reader.result)
            }
    
            reader.readAsDataURL(blob);
        })
    })
}


function getArtFullConversionProcessED() {
    // get blob
    // convert to binary string
    // convert back to blob
    // convert blob to data url
    return new Promise((resolve, reject) => {
        getArtArrayBuffer().then(ab => {

            // encode and decode to base64 string
            const view = new Uint8Array(ab);
            const encoded = btoa(view)
            const decoded = atob(encoded)

            const blob = new Blob([decoded], {type : 'image/jpeg'});
            var reader = new FileReader();
        
            reader.onload = function () {
                console.log(reader.result);
                resolve(reader.result)
            }
    
            reader.readAsDataURL(blob);
        })
    })
}


function displayArtFromDataUrl() {
    getArtDataUrl().then(imageDataUrl => {
        let imageNode = document.createElement('img')
        imageNode.src = imageDataUrl
        const div = document.getElementById('imageDiv')
        div.appendChild(imageNode)
        console.log('load and display image with javascript')
    })
}


function getArtEncodedString() {
    return getArtDataUrl()
        .then((imageDataUrl) => {
            // imageDataUrl represents the images's data as a base64 encoded string.
            // To decode back to image we need to "remove data:image/jpeg;base64," from the beginning
            const onlyString = imageDataUrl.slice(imageDataUrl.indexOf(',') + 1)
            return onlyString
        })
}


function decodeAndDisplayArtFromDataUrl() {
    getArtDataUrl()
        .then((imageDataUrl) => {
            // imageDataUrl represents the images's data as a base64 encoded string.
            // To decode back to image we need to "remove data:image/jpeg;base64," from the beginning
            const onlyString = imageDataUrl.slice(imageDataUrl.indexOf(',') + 1)

            const binary = atob(onlyString)

            // convert binary to image url to test if we can display image
            const imageObjectURL = URL.createObjectURL(binary);
            console.log('base64 string converted back to binary, then converted to url', imageObjectURL);
            return imageObjectURL

        })
        .then(imageUrl => {
            let imageNode = document.createElement('img')
            imageNode.src = imageUrl
            const div = document.getElementById('imageDiv')
            div.appendChild(imageNode)
            console.log('load and display image with javascript')
        })
}


function displayArtFromFullConversionProcess() {
    getArtFullConversionProcess().then(imageDataUrl => {
        let imageNode = document.createElement('img')
        imageNode.src = imageDataUrl
        const div = document.getElementById('imageDiv')
        div.appendChild(imageNode)
        console.log('load and display image with javascript')
    })
}


function displayArtFromFullConversionProcessED() {
    getArtFullConversionProcessED().then(imageDataUrl => {
        let imageNode = document.createElement('img')
        imageNode.src = imageDataUrl
        const div = document.getElementById('imageDiv')
        div.appendChild(imageNode)
        console.log('load and display image with javascript')
    })
}



function getResizedImage(compressionFactor) {

    // Read the files using the HTML5 FileReader API with .readAsArrayBuffer

    // Create a Blob with the file data and get its url with window.URL.createObjectURL(blob)

    // Create new Image element and set it's src to the file blob url

    // Send the image to the canvas. The canvas size is set to desired output size

    // Get the scaled-down data back from canvas via canvas.toDataURL("image/jpeg",0.7) (set your own output format and quality)

    // Attach new hidden inputs to the original form and transfer the dataURI images basically as normal text

    // On backend, read the dataURI, decode from Base64, and save it

    return getArtDataUrl().then(imageUrl => {
        let imageNode = document.createElement('img')
        imageNode.src = imageUrl
        let canvas = document.getElementById('canvas')
        // const div = document.getElementById('imageDiv')
        // div.appendChild(imageNode)
        // console.log('load and display image with javascript')

        let width = imageNode.width
        let height = imageNode.height
        

        var ctx = canvas.getContext("2d");
        ctx.drawImage(imageNode, 0, 0, 300, 150);

        // ctx.fillStyle = 'green';
        // ctx.fillRect(10, 10, 150, 100);

        return canvas.toDataURL("image/jpeg", compressionFactor); // get the data from canvas as 70% JPG (can be also PNG, etc.)
    })

}


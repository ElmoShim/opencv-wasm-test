import cvModule from '/build_wasm/util.js';


let read_file = (file) =>{

    return new Promise((resolve, reject)=>{
        let reader = new FileReader();
        reader.onload = (e)=>{
            const uint8_view = new Uint8Array(e.target.result);
            resolve(uint8_view);
        }
        reader.readAsArrayBuffer(file);
    })
}


let main = async ()=>{

    console.log("main");

    // Initialize WASM module
    let app = await cvModule();
    let CVManager = new app.CVManager();

    // Sample image
    let image = document.getElementById("target_image");

    // case1 : send UInt8ClampAray
    let width = image.width;
    let height = image.height;
    let channel = 3
    let array = new Uint8ClampedArray(width * height * 4);

    let start = new Date();
    CVManager.ImportByArray(array, width, height, channel);
    let end = new Date()

    console.log("elapsed : ", (end - start) / 1000, "seconds" );

    // teST IMPORT IMAGE
    // console.log(image);

    let res = await fetch(image.src)
    let blob = await res.blob();
    
    const uint8_view = await read_file(blob)
    


    start = new Date()
    app.FS.writeFile("test.jpg", uint8_view);
    CVManager.ImportByFile("test.jpg");
    end = new Date();
    console.log("elapsed : ", (end - start) / 1000, "seconds" );
}

main();
import cvModule from '/build_wasm/util.js';


let app = null;
let CVManager = null;

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


let onImport = async (e) =>{
    let image_file = e.target.files[0];
    

    let image_blob = new Blob([image_file], {type : 'image/jpeg'});
    console.log(image_blob)

    // Write file to wasm 
    const uint8_view = await read_file(image_blob);

    await app.FS.writeFile("test.jpg", uint8_view, {encoding : 'binary'});
    let status = app.FS.stat("test.jpg")
    console.log(status);

    CVManager.ImportByFile("test.jpg");
    
}

let main = async ()=>{

    
    console.log("main");

    // Initialize WASM module
    app = await cvModule();
    CVManager = new app.CVManager();

    // Sample Image 
    let image = document.getElementById("target_image");

    // case1 : send UInt8ClampAray
    let width = 6161;
    let height = 3466;
    let channel = 3
    let array = new Uint8ClampedArray(width * height * 4);
    let start = new Date();
    CVManager.ImportByArray(array, width, height, channel);
    let end = new Date()
    console.log("elapsed : ", (end - start) / 1000, "seconds" );



    // case2 : Write file by wasm FS, and read from cpp
    let res = await fetch(image.src)
    let blob = await res.blob();

    console.log(blob);
    const uint8_view = await read_file(blob)
    start = new Date()
    await app.FS.writeFile("test.png", uint8_view);
    CVManager.ImportByFile("test.png");
    end = new Date();
    console.log("elapsed : ", (end - start) / 1000, "seconds" );

    
    // ADd Button Event
    let inputimage = document.getElementById("import_image");
    inputimage.addEventListener("change", e=>{onImport(e)})



}

main();
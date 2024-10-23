import cvModule from '/build_wasm/util.js';

let main = async ()=>{

    console.log("main");

    // Initialize WASM module
    let app = await cvModule();
    let CVManager = new app.CVManager();

    // case1 : send UInt8ClampAray
    let width = 8196;
    let height = 8196;
    let channel = 4
    let array = new Uint8ClampedArray(width * height * 4);
    
    CVManager.ImportByArray(array, width, height, channel);
}

main();
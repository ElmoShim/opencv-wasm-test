#include "cvmanager.h"
#include <iostream>
#include <opencv2/core/utility.hpp>
#include <opencv2>
// #include <opencv2/imgproc.hpp>

CVManager::CVManager(){
    std::cout << "Build with opencv" << std::endl;
}

void CVManager::ImportByArray(emscripten::val array, int width, int height, int channel){

    std::vector<char> array_in_vector = emscripten::convertJSArrayToNumberVector<char>(array); // crash
    std::cout << "Array Importe : " << width << "x" << height << "x" << channel << std::endl;

    cv::Mat image(width, height, 0, array_in_vector.data());

    std::cout << image.size() << std::endl;
}   

void CVManager::ImportByFile(std::string filename){


    cv::Mat image = cv::imread(filename.c_str(), cv::IMREAD_UNCHANGED);
    if(image.empty()){
        std::cout << "something wrong with imagefile : " << filename <<  std::endl;        
        
    }
    std::cout << image.size() << std::endl;

}

void CVManager::ImportByBase64(std::string base64string){

    std::cout << "BASE64 String Converted" << std::endl;

}

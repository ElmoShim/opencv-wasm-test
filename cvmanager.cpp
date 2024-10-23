#include "cvmanager.h"
#include <iostream>
#include <opencv2/core/utility.hpp>
#include <opencv2/imgcodecs/imgcodecs.hpp>


CVManager::CVManager(){
    std::cout << "Build with opencv" << std::endl;
}

void CVManager::ImportByArray(emscripten::val array, int width, int height, int channel){

    // std::vector<char> array_in_vector = emscripten::convertJSArrayToNumberVector<char>(array); // crash
    std::cout << "Array Importe : " << width << "x" << height << "x" << channel << std::endl;
}   

void CVManager::ImportByFile(std::string filename){

    cv::Mat image = cv::imread(filename.c_str());

    std::cout << image.size() << std::endl;

}

void CVManager::ImportByBase64(std::string base64string){

    std::cout << "BASE64 String Converted" << std::endl;

}

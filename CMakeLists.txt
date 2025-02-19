cmake_minimum_required(VERSION 3.17)
project(util)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)



# TODO : Add OpenCV
include(FetchContent)

FetchContent_Declare(
    opencv
    GIT_REPOSITORY https://github.com/opencv/opencv.git
    GIT_TAG 4.6.0
    GIT_SHALLOW TRUE
    GIT_PROGRESS TRUE
)

set(CPU_DISPATCH                    '') 
set(CV_TRACE                    OFF) 
set(BUILD_SHARED_LIBS                    OFF) 
set(WITH_1394                    OFF) 
set(WITH_ADE                    OFF) 
set(WITH_VTK                    OFF) 
set(WITH_EIGEN                    OFF) 
set(WITH_FFMPEG                    OFF)
set(WITH_GSTREAMER                    OFF) 
set(WITH_GTK                    OFF) 
set(WITH_GTK_2_X                    OFF) 
set(WITH_IPP                    OFF) 
set(WITH_JASPER                    OFF) 
set(WITH_JPEG                    ON)
set(WITH_WEBP                    OFF) 
set(WITH_OPENEXR                    OFF) 
set(WITH_OPENGL                    OFF) 
set(WITH_OPENVX                    OFF) 
set(WITH_OPENNI                    OFF) 
set(WITH_OPENNI2                    OFF) 
set(WITH_PNG                    ON) 
set(WITH_TBB                    OFF) 
set(WITH_TIFF                    OFF) 
set(WITH_V4L                    OFF) 
set(WITH_OPENCL                    OFF) 
set(WITH_OPENCL_SVM                    OFF) 
set(WITH_OPENCLAMDFFT                    OFF) 
set(WITH_OPENCLAMDBLAS                    OFF) 
set(WITH_GPHOTO2                    OFF) 
set(WITH_LAPACK                    OFF) 
set(WITH_ITT                    OFF) 
set(WITH_QUIRC                    OFF) 
set(BUILD_ZLIB                    ON) 
set(BUILD_opencv_apps                    OFF) 
set(BUILD_opencv_calib3d                    ON) 
set(BUILD_opencv_dnn                    ON) 
set(BUILD_opencv_features2d                    ON) 
set(BUILD_opencv_flann                    ON) 
set(BUILD_opencv_gapi                    OFF) 
set(BUILD_opencv_ml                    OFF) 
set(BUILD_opencv_photo                    ON) 
set(BUILD_opencv_imgcodecs                    ON)
set(BUILD_opencv_shape                    OFF) 
set(BUILD_opencv_videoio                    OFF) 
set(BUILD_opencv_videostab                    OFF) 
set(BUILD_opencv_highgui                    OFF) 
set(BUILD_opencv_superres                    OFF) 
set(BUILD_opencv_stitching                    OFF) 
set(BUILD_opencv_java                    OFF) 
set(BUILD_opencv_js                    OFF) 
set(BUILD_opencv_python2                    OFF) 
set(BUILD_opencv_python3                    OFF) 
set(BUILD_EXAMPLES                    OFF) 
set(BUILD_PACKAGE                    OFF) 
set(BUILD_TESTS                    OFF) 
set(BUILD_PERF_TESTS                    ON)
set(BUILD_DOCS                    OFF)
set(WITH_PTHREADS_PF                    OFF)
set(CV_ENABLE_INTRINSICS                    OFF)
set(BUILD_WASM_INTRIN_TESTS                    OFF)

FetchContent_MakeAvailable(opencv)

# find_package(OpenCV REQUIRED)


# -----------------------------------------------------------------------------
# Compile example code
# -----------------------------------------------------------------------------

add_executable(${CMAKE_PROJECT_NAME} cvmanager.cpp)

target_link_libraries(${CMAKE_PROJECT_NAME}
    PRIVATE
    opencv_core opencv_imgcodecs
)

target_include_directories(${CMAKE_PROJECT_NAME}
    PRIVATE
    ${OPENCV_CONFIG_FILE_INCLUDE_DIR}
    ${OPENCV_MODULE_opencv_core_LOCATION}/include
    ${OPENCV_MODULE_opencv_imgproc_LOCATION}/include
    ${OPENCV_MODULE_opencv_imgcodecs_LOCATION}/include
)

# set_target_properties(${CMAKE_PROJECT_NAME} PROPERTIES CXX_STANDARD 20 CXX_STANDARD_REQUIRED YES)


# -----------------------------------------------------------------------------
# WebAssembly build options
# -----------------------------------------------------------------------------
set(emscripten_link_options)
set(emscripten_compile_options)

list(APPEND emscripten_link_options
    "--bind"
    "SHELL:-s MODULARIZE=1"  
    "SHELL:-s WASM=1"
    "SHELL:-s EXPORT_ES6=1"
    "SHELL:-s ALLOW_MEMORY_GROWTH=1"
    "SHELL:-s EXPORT_NAME=managerModule"
    "SHELL:-s EXPORTED_RUNTIME_METHODS=['FS']"
)

set(emscripten_debug_options)
set(DEBUGINFO "PROFILE" CACHE STRING "Type of debug info")
set_property(CACHE DEBUGINFO PROPERTY
    STRINGS
        NONE              # -g0
        READABLE_JS       # -g1
        PROFILE           # -g2
        DEBUG_NATIVE      # -g3
)

if(DEBUGINFO STREQUAL "NONE")
    list(APPEND emscripten_debug_options
        "-g0"
    )
    elseif(DEBUGINFO STREQUAL "READABLE_JS")
    list(APPEND emscripten_debug_options
        "-g1"
    )
    list(APPEND emscripten_link_options
        "SHELL:-s DEMANGLE_SUPPORT=1"
    )
    elseif(DEBUGINFO STREQUAL "PROFILE")
    list(APPEND emscripten_debug_options
        "-g2"
    )
    list(APPEND emscripten_link_options
        "SHELL:-s DEMANGLE_SUPPORT=1"
    )
    elseif(DEBUGINFO STREQUAL "DEBUG_NATIVE")
    list(APPEND emscripten_debug_options
        "-g3"
    )
    list(APPEND emscripten_link_options
        "SHELL:-s ASSERTIONS=1"
        "SHELL:-s DEMANGLE_SUPPORT=1"
    )
endif()

# -----------------------------------------------------------------------------
# Build options
# -----------------------------------------------------------------------------
set(emscripten_optimizations)
set(OPTIMIZE "SMALLEST_WITH_CLOSURE" CACHE STRING "Emscripten optimization")
set_property(CACHE OPTIMIZE PROPERTY
    STRINGS
        NO_OPTIMIZATION       # -O0
        LITTLE                # -O1
        MORE                  # -O2
        BEST                  # -O3
        SMALL                 # -Os
        SMALLEST              # -Oz
        SMALLEST_WITH_CLOSURE # -Oz --closure 1
)

if(OPTIMIZE STREQUAL "NO_OPTIMIZATION")
    list(APPEND emscripten_optimizations
        "-O0"
    )
    elseif(OPTIMIZE STREQUAL "LITTLE")
    list(APPEND emscripten_optimizations
        "-O1"
    )
    elseif(OPTIMIZE STREQUAL "MORE")
    list(APPEND emscripten_optimizations
        "-O2"
    )
    elseif(OPTIMIZE STREQUAL "BEST")
    list(APPEND emscripten_optimizations
        "-O3"
    )
    elseif(OPTIMIZE STREQUAL "SMALL")
    list(APPEND emscripten_optimizations
        "-Os"
    )
    elseif(OPTIMIZE STREQUAL "SMALLEST")
    list(APPEND emscripten_optimizations
        "-Oz"
    )
    elseif(OPTIMIZE STREQUAL "SMALLEST_WITH_CLOSURE")
    list(APPEND emscripten_optimizations
        "-Oz"
    )
    list(APPEND emscripten_link_options
        "--closure 1"
    )
endif()

target_compile_options(${CMAKE_PROJECT_NAME}
    PUBLIC
        ${emscripten_compile_options}
        ${emscripten_optimizations}
        ${emscripten_debug_options}
)

target_link_options(${CMAKE_PROJECT_NAME}
    PUBLIC
        ${emscripten_link_options}
        ${emscripten_optimizations}
        ${emscripten_debug_options}
)
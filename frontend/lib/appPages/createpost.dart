import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:frontend/apiFolder/image_service.dart';
import 'package:image_picker/image_picker.dart';

class CreatePostPage extends StatelessWidget {
  CreatePostPage({super.key});
  final WebImagePickerController _webImagePickerController =
      WebImagePickerController();

  Uint8List? getImageAsBytes() {
    return _webImagePickerController.getImageAsBytes != null
        ? _webImagePickerController.getImageAsBytes!()
        : null;
  }

  XFile? getImageAsXFile() {
    return _webImagePickerController.getImageAsXFile != null
        ? _webImagePickerController.getImageAsXFile!()
        : null;
  }
  Future<void> handleUpload(BuildContext context) async {
    final Uint8List? imageBytes = getImageAsBytes();
    if (imageBytes != null) {
      print("Image bytes retrieved successfully.");
      // Initialize your backend service
      ImageService imageService = ImageService("http://localhost:3000");
      String base64Image = base64Encode(imageBytes);
      print(imageBytes);
      // Send the image bytes to your backend (using imageService)
      var result = await imageService.uploadImage(base64Image, "temp");

      if (result != null) {
        print("Backend Response: $result");
      } else {
        print("Unknown Error from Backend");
      }
        } else {
      print("No image selected");
    }
  }

  @override
  Widget build(BuildContext context) {
    final WebImagePicker webImagePicker =
        WebImagePicker(controller: _webImagePickerController);
    return Container(
      child: Column(
        children: [
          const Text("Pick an image"),
          TextButton(
              onPressed: () {
                handleUpload(context);
              },
              child: const Text("Upload Image as Test")),
          Expanded(
              child:
                  FractionallySizedBox(widthFactor: 0.8, child: webImagePicker))
        ],
      ),
    );
  }
}

// ignore: must_be_immutable
class WebImagePicker extends StatefulWidget {
  WebImagePickerController? controller;

  WebImagePicker({super.key, this.controller});

  @override
  _WebImagePickerState createState() => _WebImagePickerState();
}

class _WebImagePickerState extends State<WebImagePicker> {
  Uint8List? _imageBytes;
  XFile? _imageXfile;

  @override
  void initState() {
    super.initState();
    if (widget.controller != null) {
      widget.controller!
          .attachGetImageFunction(getImageAsBytes, getImageAsXFile);
    }
  }

  Future<void> pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);

    if (image != null) {
      final bytes = await image.readAsBytes();
      setState(() {
        _imageBytes = bytes;
        _imageXfile = image;
      });
    }
  }

  Uint8List? getImageAsBytes() {
    return _imageBytes;
  }

  XFile? getImageAsXFile() {
    return _imageXfile;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Flutter Web Image Picker')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: pickImage,
              child: const Text('Select Image'),
            ),
            if (_imageBytes != null) Image.memory(_imageBytes!),
          ],
        ),
      ),
    );
  }
}

class WebImagePickerController {
  // Declare getImage as nullable to avoid late initialization errors
  Uint8List? Function()? getImageAsBytes;
  XFile? Function()? getImageAsXFile;

  // Attach the getImage function
  void attachGetImageFunction(
      Uint8List? Function()? getImageAsB, XFile? Function()? getImageAsX) {
    getImageAsBytes = getImageAsB;
    getImageAsXFile = getImageAsX;
  }
}

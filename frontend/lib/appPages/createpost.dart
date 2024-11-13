import 'dart:convert';
import 'dart:typed_data';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:frontend/apiFolder/image_service.dart';
import 'package:frontend/apiFolder/imgur_service.dart';
import 'package:frontend/storage/authentication.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

class CreatePostPage extends StatelessWidget {
  CreatePostPage({super.key});
  final WebImagePickerController _webImagePickerController =
      WebImagePickerController();

  Uint8List? getImage() {
    return _webImagePickerController.getImage != null
        ? _webImagePickerController.getImage!()
        : null;
  }

  Future<void> handleUpload(BuildContext context) async {
    final Uint8List? imageBytes =
        getImage();
    if (imageBytes != null) {
      // Directly pass imageBytes to the upload service
      ImageService imageService = ImageService("http://localhost:3000");
      String base64Image = base64Encode(imageBytes);
      
      //final jwtToken = Provider.of<AuthProvider>(context, listen: false).token;
      var result = await imageService.uploadImage(base64Image,"temp");
      if (result!=null) {
        print(result);
      } else {
        print("Unknown Error");
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

class WebImagePicker extends StatefulWidget {
  WebImagePickerController? controller;

  WebImagePicker({super.key, this.controller});

  @override
  _WebImagePickerState createState() => _WebImagePickerState();
}

class _WebImagePickerState extends State<WebImagePicker> {
  Uint8List? _imageBytes;

  @override
  void initState() {
    super.initState();
    if (widget.controller != null) {
      widget.controller!.attachGetImageFunction(getImage);
    }
  }

  Future<void> pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);

    if (image != null) {
      final bytes = await image.readAsBytes();
      setState(() {
        _imageBytes = bytes;
      });
    }
  }

  Uint8List? getImage() {
    return _imageBytes;
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
  Uint8List? Function()? getImage;

  // Attach the getImage function
  void attachGetImageFunction(Uint8List? Function()? getImageFn) {
    getImage = getImageFn;
  }
}

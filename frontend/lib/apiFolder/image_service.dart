import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';

class ImageService {
  final String baseUrl;

  ImageService(this.baseUrl);
  final base_headers = {'Content-Type': 'application/json'};

  Future<dynamic> uploadImage(String base64Image) async {
    
    final Map<String, dynamic> payload = {
      'image': base64Image,
      // Add any other metadata you may want, like image name or type
    };

    Uri uri = Uri.parse("$baseUrl/postImages");

    try {
      Response response = await http.post(
        uri,
        headers: base_headers,
        body: jsonEncode(payload),
      );
      if (response.statusCode == 201) {
        return "Image Uploaded Successfully";
      } else {
        return "Failed to upload image: ${response.body}";
      }
    } catch (error) {
      print("Error: $error");
      return "Unknown error occurred";
    }
  }
}

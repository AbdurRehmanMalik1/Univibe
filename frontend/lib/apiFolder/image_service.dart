import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';

class ImageService {
  final String baseUrl;
  final String jwtToken;
  ImageService(this.baseUrl, this.jwtToken);

  final base_headers = {'Content-Type': 'application/json'};

  Future<dynamic> uploadImage(String imageUrls) async {
    String jwtToken = "Bearer ${this.jwtToken}";
    const String title = 'A Valid Title';
    const String description =
        'This is a valid description. quirement necessary length for a valid description that will pass the validation check that requires it to be between 100 and 1000 characters.';
    const String location = 'Cafe';
    final Map<String, dynamic> payload = {
      'title': title,
      'description': description,
      'location': location,
      'activityTypeId': 3,
      'imageUrls': [imageUrls, imageUrls],
    };

    Uri uri = Uri.parse("$baseUrl/posts/create");
    base_headers['Authorization'] = jwtToken;

    try {
      Response response = await http.post(
        uri,
        headers: base_headers,
        body: jsonEncode(payload),
      );
      if (response.statusCode == 201) {
        return "Post Image Uploaded Successfully";
      } else {
        return "Failed to Post: ${response.body}";
      }
    } catch (error) {
      print("Error: $error");
      return "Unknown error occurred";
    }
  }
}

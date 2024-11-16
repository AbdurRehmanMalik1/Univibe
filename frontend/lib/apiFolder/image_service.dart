import 'dart:convert';
import 'package:frontend/apiFolder/api_service.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';

//  @Post('create')
//   @UseGuards(JwtAuthGuard)
//   async createPost(
//     @Body('title') title: string,
//     @Body('description') description: string,
//     @Body('location') location: string,
//     @Body('activityTypeId') activityTypeId: number,
//     @Body('imageUrls') imageUrls: string[],
//     @Req() req: any,
//   ) {
class ImageService {
  final String baseUrl;

  ImageService(this.baseUrl);

  final base_headers = {'Content-Type': 'application/json'};

  Future<dynamic> uploadImage(String imageUrls, String jwtToken) async {
    ApiService apiService = ApiService(baseUrl);

    // Login and get JWT token
    final responseLogin = await apiService.login("abdurrehman4415@gmail.com", "a12345678");

    jwtToken = "Bearer ${responseLogin['access_token']}";

    // Creating appropriate test data based on the conditions
    const String title = 'A Valid Title That Is Between 50 and 200 Characters Long, This Title Is Just Enough to Satisfy the Validation Rule Set for Length.32111111111111111111111111111111111111111113';
    const String description = 'This is a valid description. It is long enough to meet the minimum requirement of 100 characters. Here, we can add some more text to reach the necessary length for a valid description that will pass the validation check that requires it to be between 100 and 1000 characters.';
    const String location = 'Lahore, Pakistan';

    // Validating the test data (mimicking your backend validation)
    if (title.trim().isEmpty) throw Exception('Title is required and cannot be empty.');
    if (description.trim().isEmpty) throw Exception('Description is required and cannot be empty.');
    if (location.trim().isEmpty) throw Exception('Location is required and cannot be empty.');

    if (title.length < 50 || title.length > 200) {
      throw Exception('Title must be between 50 and 200 characters long.');
    }

    if (description.length < 100 || description.length > 1000) {
      throw Exception('Description must be between 100 and 1000 characters.');
    }

    // Prepare payload
    final Map<String, dynamic> payload = {
      'title': title,
      'description': description,
      'location': location,
      'activityTypeId': 3, // You can change this depending on the specific activity
      'imageUrls': [imageUrls],
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

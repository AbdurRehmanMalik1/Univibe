import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';

class PostApiService {
  final String baseUrl;
  final String jwtToken;
  PostApiService(this.baseUrl,this.jwtToken);
  final base_headers = {'Content-Type': 'application/json'};
  Future<dynamic> getAllPosts() async {
    // ApiService apiService = ApiService("http://localhost:3000");
    // var tokenResponse = await apiService.login("abdurrehman4415@gmail.com", "a12345678");
    // String jwtToken =  tokenResponse['access_token'];
    String jwtToken = "Bearer ${this.jwtToken}";
    Uri url = Uri.parse("$baseUrl/posts/all");
    final Response response = await http.get(
      url,
      headers: {'Content-Type': 'application/json' , 'Authorization' : jwtToken},
    );
    if (response.statusCode >= 200 && response.statusCode < 300) {
     return response.body;
    } else {
      final responseBody = json.decode(response.body);
      throw Exception(responseBody['message'] ?? 'Unknown error occurred');
    }
  }

}

import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  final String baseUrl;

  ApiService(this.baseUrl);

  Future<dynamic> login(String email, String password) async {
    Uri url = Uri.parse("$baseUrl/auth/login");
    final response = await http.post(
      url,
      body: jsonEncode({'email': email, 'password': password}),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return json.decode(response.body);
    } else {
      final responseBody = json.decode(response.body);
      throw Exception(responseBody['message'] ?? 'Unknown error occurred');
    }
  }

  Future<dynamic> signUp(String email, String password) async {
    final url = Uri.parse('$baseUrl/users/send-verification');

    try {
      final response = await http.post(
        url,
        body: jsonEncode({'email': email, 'password': password}),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to sign up: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error during sign up: $e');
    }
  }

  // Add other API methods here
}

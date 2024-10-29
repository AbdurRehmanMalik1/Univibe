import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:frontend/signup/signup_username.dart';
import 'package:frontend/storage/authentication.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';
import 'package:provider/provider.dart';

class ApiService {
  final String baseUrl;

  ApiService(this.baseUrl);
  final base_headers = {'Content-Type': 'application/json'};

  Future<dynamic> login(String email, String password) async {
    Uri url = Uri.parse("$baseUrl/auth/login");
    final response = await http.post(
      url,
      body: jsonEncode({'email': email, 'password': password}),
      headers: base_headers,
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      //print(response.body);
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
        headers: base_headers,
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

  Future<dynamic> sendVerificationCode(
      BuildContext context, String email, String enteredCode) async {
    Uri url = Uri.parse("http://localhost:3000/users/verify-code");
    try {
      final Response response = await http.post(
        url, body: jsonEncode({'email': email, 'code': enteredCode}),
        headers: {
          'Content-Type': 'application/json'
        }, // Set content type for JSON
      );
      var responseBody = jsonDecode(response.body);
      if (responseBody['message'] != null) {
        return response;
      } else {
        return null;
      }
    } catch (exception) {
      return null;
    }
  }

  Future<dynamic> addUserContacts(BuildContext context,
      List<String> contactTypes, List<String> contactValues) async {
    final responseLogin = await login("abdurrehman4415@gmail.com", "a12345678");

    final jwtToken = "Bearer ${responseLogin['access_token']}";
    print(jwtToken);
    print("\n");
    //final jwtToken = Provider.of<AuthProvider>(context, listen: false).token;
    // const token =
    //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6ImFiZHVycmVobWFuNDQxNUBnbWFpbC5jb20iLCJpYXQiOjE3MzAwNTg0NDh9.qoOUEazuDozg2oaMOsg02DXTHop1w8nzsm4pZr-Reyg";
    // const jwtToken = "Bearer $token";

    // print(jwtToken);
    final Uri url = Uri.parse("$baseUrl/contacts");

    int counter = contactTypes.length;
    try {
      for (int i = 0; i < counter; i++) {
        final response = await http.post(url,
            body: json.encode({
              'contact_type': contactTypes[i],
              'contact_value': contactValues[i]
            }),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': jwtToken
            });
        //printing the reponse body each time
        if (response.statusCode == 201) {
          print("Sucess: Response ${response.body}");
        } else {
          print("Faliure: ${response.body}");
        }
      }
    } catch (exception) {
      print(exception);
    }
  }

  // Add other API methods here
}

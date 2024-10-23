import 'package:flutter/material.dart';
import 'package:frontend/signup/login.dart';
import 'package:frontend/signup/signup_username.dart';
import 'package:frontend/signup/verification.dart';
import './signup/signup.dart'; // Adjust the import based on your file structure

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'UniVibe',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home:  LoginPage(), // Set SignUpPage as the home page
    );
  }
}

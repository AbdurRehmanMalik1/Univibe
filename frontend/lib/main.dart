import 'package:flutter/material.dart';
import 'package:frontend/signup/contact_info.dart';
import 'package:frontend/signup/login.dart';
import 'package:frontend/signup/signup_username.dart';
import 'package:frontend/signup/verification.dart';
import './signup/signup.dart'; // Adjust the import based on your file structure
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'storage/authentication.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => AuthProvider(),
      child: const MyApp(),
    ),
  );
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
      // home:  ContactInfoPage(username: '',), // Set SignUpPage as the home page
      home: ContactInfoPage()
    );
  }
}

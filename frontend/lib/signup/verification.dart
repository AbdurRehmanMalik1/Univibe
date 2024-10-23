import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:frontend/signup/signup_username.dart';
import 'package:http/http.dart' as http;
class VerificationPage extends StatefulWidget {
  final String email; // Add this line to accept the passed email

  VerificationPage({required this.email, super.key}); // Update constructor to accept email

  @override
  _VerificationPageState createState() => _VerificationPageState();
}

class _VerificationPageState extends State<VerificationPage> {
  final TextEditingController _verificationCodeController = TextEditingController();
  String _errorMessage = '';

  //String sentCode = '123456'; // Hardcoded sent code for now

  void _verifyCode() async{
    String enteredCode = _verificationCodeController.text;
    Uri url =Uri.parse("http://localhost:3000/users/verify-code");

    final response = await http.post(url
    , body:jsonEncode({
      'email':widget.email,
      'code':enteredCode
    }),
      headers: {'Content-Type': 'application/json'}, // Set content type for JSON 
    );
    var responseBody = jsonDecode(response.body);
    print(responseBody);
    if (response.statusCode >=200 && response.statusCode<=299) {
      print("Switching to success page");
      Navigator.push(
        context,
        MaterialPageRoute(builder:(context)=>SignupUsername(email: widget.email,),
        ),
      );
    } else {
      // Show an error message if the code doesn't match
      setState(() {
        if(responseBody['message']!=null){
          _errorMessage = responseBody['message'];
        }
        else{
           _errorMessage = "Unknown Error Try again later";
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Enter Verification Code'),
      ),
      body: Center(
        child: Container(
          decoration: BoxDecoration(
            border: Border.all(
              color: Colors.black,
              width: 2.0,
            ),
            borderRadius: BorderRadius.circular(10),
          ),
          padding: const EdgeInsets.only(
            top: 20,
            bottom: 40,
            left: 20,
            right: 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.start,
            children: <Widget>[
              const Text(
                'Enter Verification Code',
                style: TextStyle(
                  fontSize: 30,
                ),
              ),
              const SizedBox(height: 10),
              // Add this line to show the email below the heading
              Text(
                'A verification code has been sent to ${widget.email}', // Display email passed from SignUpPage
                style: const TextStyle(
                  fontSize: 14,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 20),
              ConstrainedBox(
                constraints: const BoxConstraints(
                  maxWidth: 750,
                ),
                child: FractionallySizedBox(
                  widthFactor: 0.5,
                  child: TextField(
                    controller: _verificationCodeController,
                    decoration: const InputDecoration(
                      labelText: 'Verification Code',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.all(10.0),
                child: Container(
                  width: 170,
                  child: TextButton(
                    onPressed: _verifyCode,
                    style: TextButton.styleFrom(
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Verify'),
                  ),
                ),
              ),
              const SizedBox(height: 10),
              if (_errorMessage.isNotEmpty)
                Text(
                  _errorMessage,
                  style: const TextStyle(color: Colors.red),
                ),
            ],
          ),
        ),
      ),
    );
  }
}



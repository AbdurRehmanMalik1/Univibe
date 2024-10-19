import 'package:flutter/material.dart';

// These two bottom packages are for converting data 
// and sending API call
import 'package:http/http.dart' as http;
import 'dart:convert';
// Top 2
void main() {
  runApp(const SignUpPage());
}
class SignUpPage extends StatelessWidget {
  const SignUpPage({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Fast Media App',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a purple toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Fast Media App Users Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  var _users = []; // Initialize _users as an empty list

  // Function to fetch user data from the API
  void _getUserIds() async {
    http.Response response = await http.get(Uri.parse('http://localhost:3000/users'));
    if (response.statusCode == 200) {
      var retrievedUsers = jsonDecode(response.body); // Decoding JSON data
      print(retrievedUsers);
      // You can now work with the list of users
      // If you want to work with user IDs and other details:
      // Assuming the retrievedUsers is a List of user objects
      setState(() {
        _users = retrievedUsers; // Update _users state with the retrieved data
      });
    } else {
      print(response.statusCode); // If the API call fails
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        // backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        // title: Text(widget.title),
      ),
      body: Center(
        child:Container(
          decoration: BoxDecoration(
            border: Border.all(
              color: Colors.black,
              width: 2.0
            ),
            borderRadius: BorderRadius.circular(10) ,
          ),
          padding: const EdgeInsets.only(
            top:20,
            bottom: 40,
            left: 20,
            right:20
          ),
          child: Column(
             mainAxisSize: MainAxisSize.min,
            mainAxisAlignment:MainAxisAlignment.start,
            children: <Widget>[
              const Text(
                'Sign Up',
                style: TextStyle(
                  fontSize: 30, // Set the font size here
                ),
              ),
              const SizedBox(height: 60,),  
              //second row (after sign up)
              ConstrainedBox(
                constraints: const BoxConstraints(
                  maxWidth: 750, // Set your desired max width here
                ),
                child: const FractionallySizedBox(
                  widthFactor: 0.5, // The width factor will take up 50% of the parent's width
                  child: const TextField(
                    decoration: InputDecoration(
                      labelText: 'Enter Your Email',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.emailAddress,
                  ),
                ),
              ),
              const SizedBox(height: 20,),
              ConstrainedBox(
                constraints: const BoxConstraints(
                  maxWidth: 750, // Set your desired max width here
                ),
                child: const FractionallySizedBox(
                  widthFactor: 0.5, // The width factor will take up 50% of the parent's width
                  child: const TextField(
                    decoration: InputDecoration(
                      labelText: 'Enter Your Password',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.emailAddress,
                  ),
                ),
              ),
              const SizedBox(height: 20,),
              Padding(
                padding: const EdgeInsets.all(10.0), // Padding around the button
                child: Container(
                  width: 170, // Set your desired width here
                  //height: 50, // Set your desired height here
                  child: TextButton(
                    onPressed: _getUserIds,
                    style: TextButton.styleFrom(
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Sign Up'),
                  ),
                ),
              )
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _getUserIds,
        tooltip: 'Get Users',
        child: const Icon(Icons.refresh),
      ),
    );
  }
}

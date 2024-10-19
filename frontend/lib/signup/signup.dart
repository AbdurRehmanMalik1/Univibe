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
        child: Column(
          mainAxisAlignment:MainAxisAlignment.center,
          children: <Widget>[
            const Text('This is the Sign up form')
          ],

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

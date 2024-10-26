

import 'package:flutter/material.dart';

class ContactInfoPage extends StatelessWidget{
  final String username ;
  ContactInfoPage({super.key , required this.username});
  
  @override
  Widget build(BuildContext context) {
      return Scaffold(  
        body:Center(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                child: const Text(
                  "Before Proceeding to login Enter Your Contact Information",
                  style: TextStyle(
                    fontSize: 18
                  ),
                ),
              )
            ],
          ),
        )
    );
  }

  
}
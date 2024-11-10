import 'package:flutter/material.dart';

// ignore: must_be_immutable
class Homepage extends StatelessWidget{
  Homepage({super.key});
  
  int postCount = 3;
  @override
  Widget build(BuildContext context) {
    // double screenWidth = MediaQuery.sizeOf(context).width;
    // double widthThreshold = 500;
    return Center(
      child: ListView.builder(itemCount: postCount, itemBuilder:(context, index) {
        return Container(
            padding: const EdgeInsets.symmetric(vertical: 10,horizontal: 20),
          child: const SizedBox(
            child: Card(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text("Post Title"),
                  Text("Post Body"),
                ],
              ),
            ),
          ),
        );
      }),
    );
  }
}
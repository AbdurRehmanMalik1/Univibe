import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:frontend/models/posts.dart';

// ignore: must_be_immutable
class Homepage extends StatelessWidget{
  Homepage({super.key});
  

  List<Post> posts = generateRandomPosts(10); // Generate 10 random posts

  Future? arc =null;
  int postCount = 3;
  @override
  Widget build(BuildContext context) {
    arc?.then((dynamic value){
      
    });
    
    // double screenWidth = MediaQuery.sizeOf(context).width;
    // double widthThreshold = 500;

    return Center(
      child: ListView.builder(itemCount: postCount, itemBuilder:(context, index) {
        return Container(
            padding: const EdgeInsets.symmetric(vertical: 10,horizontal: 20),
          child: SizedBox(
            child: Card(
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 20,horizontal: 40),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(posts[index].title ,style: const TextStyle(fontSize: 25),),
                    const SizedBox(height: 8,),
                    Text(posts[index].description),
                  ],
                ),
              ),
            ),
          ),
        );
      }),
    );
  }

}

List<Post> generateRandomPosts(int count) {
  final random = Random();
  List<Post> posts = [];

  for (int i = 0; i < count; i++) {
    int postId = i + 1;
    int userId = random.nextInt(100) + 1; // Random user ID between 1 and 100
    String title = 'Post Title $postId';
    String description = 'This is a description for post $postId.';
    String? location = (random.nextBool()) ? 'Location ${random.nextInt(50) + 1}' : null;
    int activityTypeId = random.nextInt(5) + 1; // Random activity type ID between 1 and 5
    DateTime createdAt = DateTime.now().subtract(Duration(days: random.nextInt(30)));
    DateTime expiresAt = createdAt.add(Duration(days: random.nextInt(10) + 1));

    // Generate random images for each post
    List<PostImage> images = List.generate(
      random.nextInt(3) + 1, // 1 to 3 images per post
      (index) => PostImage(
        imageId: index + 1,
        postId: postId,
        imageUrl: 'https://example.com/image${index + 1}.jpg',
        uploadedAt: DateTime.now().subtract(Duration(days: random.nextInt(10))),
      ),
    );

    posts.add(Post(
      postId: postId,
      userId: userId,
      title: title,
      description: description,
      location: location,
      activityTypeId: activityTypeId,
      createdAt: createdAt,
      expiresAt: expiresAt,
      images: images,
    ));
  }

  return posts;
}
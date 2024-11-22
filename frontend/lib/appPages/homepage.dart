import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:frontend/models/posts.dart';
import 'package:frontend/utils/utility.dart';
import 'package:http/http.dart';

// ignore: must_be_immutable
class Homepage extends StatefulWidget {
  const Homepage({super.key});

  @override
  State<Homepage> createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {
  List<Post> posts = Utils.generateRandomPosts(10);
  // Generate 10 random posts
  Future? arc;

  int postCount = 10;

  List<bool> isHoveredButton = [false, false];

  @override
  Widget build(BuildContext context) {
    arc?.then((dynamic value) {});

    double screenWidth = MediaQuery.sizeOf(context).width;
    double widthThreshold = 1000;

    return Center(
      child: ListView.builder(
          itemCount: postCount,
          itemBuilder: (context, index) {
            return FractionallySizedBox(
              widthFactor: screenWidth < widthThreshold ? 0.9 : 0.8,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
                child: SizedBox(
                  child: Card(
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          vertical: 20, horizontal: 40),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Row(
                            children: [
                              Container(
                                decoration:
                                    const BoxDecoration(color: Colors.black),
                                child: const Icon(
                                  Icons.person,
                                  color: Colors.white,
                                  size: 50,
                                ),
                              ),
                              const SizedBox(
                                width: 10,
                              ),
                              const Text(
                                "Profile Name",
                                style: TextStyle(fontSize: 27),
                              ),
                            ],
                          ),
                          const SizedBox(
                            height: 8,
                          ),
                          const Divider(
                            height: 10,
                          ),
                          const SizedBox(
                            height: 8,
                          ),
                          Text(
                            posts[index].title,
                            style: const TextStyle(fontSize: 25),
                          ),
                          const SizedBox(
                            height: 8,
                          ),
                          Text(posts[index].description),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              PageViewSlider(images: posts[index].images),
                              // Image.memory(
                              //   base64Decode(posts[index].images[0].imageUrl),
                              //   fit: BoxFit.cover,
                              // )
                            ],
                          ),
                          const SizedBox(
                            width: 1,
                            height: 10,
                          ),
                          const Divider(
                            thickness: 1,
                            color: Colors.black, // color of the line
                            height: 8,
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              HoverButton(
                                  text: "Send Message",
                                  icon: const Icon(Icons.message),
                                  defaultColor:const Color.fromARGB(255, 149, 186, 229),
                                  hoverColor: const Color.fromARGB(165, 149, 186, 229),
                                  onTap: () {
                                    throw UnimplementedError(
                                        "Send Message not implemented");
                                  }),
                              HoverButton(
                                  text: "Join Activity",
                                  icon: const Icon(Icons.join_full),
                                  defaultColor: const Color.fromARGB(255, 149, 186, 229),
                                  hoverColor: const Color.fromARGB(165, 149, 186, 229),
                                  onTap: () {
                                    throw UnimplementedError(
                                        "Join Activity Not Implemented");
                                  }),
                            ],
                          )
                          //Image(image: posts[index].images[0]),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            );
          }),
    );
  }
}

class PageViewSlider extends StatefulWidget {
  List<PostImage> images = [];
  PageViewSlider({super.key, required this.images});
  @override
  State<PageViewSlider> createState() => _PageViewSliderState();
}

class _PageViewSliderState extends State<PageViewSlider> {
  final PageController _pageController = PageController();

  @override
  Widget build(BuildContext context) {
    if (widget.images.isEmpty) {
      return const Center(child: Text('No images available'));
    }
    return Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        SizedBox(
          width:30,
          child: IconButton(onPressed: (){
              _pageController.previousPage(duration: const Duration(milliseconds: 500), curve: Curves.bounceIn);
          
          }, icon: const Icon(Icons.arrow_back_ios)),
        ),
        Container(
          color: Colors.black,
          height: 250,
          width: 300,
          child: PageView.builder(
             controller: _pageController,
              onPageChanged: (int pageNumber) {
              },
              itemCount: widget.images.length,
              itemBuilder: (context, index) {
                return Image.memory(
                  base64Decode(widget.images[index].imageUrl),
                  fit: BoxFit.fitHeight,
                );
              }),
        ),
        SizedBox(
          width: 30,
          child: IconButton(onPressed: (){
              _pageController.nextPage(duration: const Duration(milliseconds: 500), curve: Curves.bounceIn);
          }, icon: const Icon(Icons.arrow_forward_ios)
          ),
        )
      ],
    );
  }
}

class HoverButton extends StatefulWidget {
  final String text;
  final Icon icon;
  final Color defaultColor;
  final Color hoverColor;
  final Function onTap;

  const HoverButton({
    super.key,
    required this.text,
    required this.icon,
    required this.defaultColor,
    required this.hoverColor,
    required this.onTap,
  });

  @override
  _HoverButtonState createState() => _HoverButtonState();
}

class _HoverButtonState extends State<HoverButton> {
  bool isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click, 
      onEnter: (_) {
        setState(() {
          isHovered = true;
          
        });
      },
      onExit: (_) {
        setState(() {
          isHovered = false;
        });
      },
      child: GestureDetector(
        onTap: () {
          widget.onTap();
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 2, horizontal: 12),
          decoration: BoxDecoration(
            shape: BoxShape.rectangle,
            color: isHovered ? widget.hoverColor : widget.defaultColor,
            borderRadius: BorderRadius.circular(50),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              widget.icon,
              Text(widget.text),
            ],
          ),
        ),
      ),
    );
  }
}

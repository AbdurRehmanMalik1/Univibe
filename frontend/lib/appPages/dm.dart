import 'package:flutter/material.dart';

class ChatScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: LayoutBuilder(
        builder: (context, constraints) {
          if (constraints.maxWidth < 600) {
            return MobileChatView();
          } else {
            return DesktopChatView();
          }
        },
      ),
    );
  }
}

class MobileChatView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Navigator(
      onGenerateRoute: (settings) {
        // Default route shows the DM list
        if (settings.name == '/' || settings.name == null) {
          return MaterialPageRoute(builder: (_) => DMListScreen());
        } else {
          // Extract the user name from the route
          final userName = settings.name!.replaceFirst('/chat/', '');
          return MaterialPageRoute(
            builder: (_) => ChatDetailScreen(userName: userName),
          );
        }
      },
      initialRoute: '/',
    );
  }
}


class DesktopChatView extends StatefulWidget {
  @override
  _DesktopChatViewState createState() => _DesktopChatViewState();
}

class _DesktopChatViewState extends State<DesktopChatView> {
  String? selectedUser;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        // Sidebar with clickable usernames
        Expanded(
          flex: 1,
          child: DMListScreen(
            onUserSelected: (userName) {
              setState(() {
                selectedUser = userName;
              });
            },
          ),
        ),
        // Chat detail area
        Expanded(
          flex: 3,
          child: selectedUser == null
              ? Center(
                  child: Text(
                    "Select a user to view the chat",
                    style: TextStyle(fontSize: 18, color: Colors.grey),
                  ),
                )
              : ChatDetailScreen(userName: selectedUser!),
        ),
      ],
    );
  }
}

class DMListScreen extends StatelessWidget {
  final Function(String)? onUserSelected;

  DMListScreen({this.onUserSelected});

  final List<String> users = [
    'Alice',
    'Bob',
    'Charlie',
    'Diana',
    'Eve',
    'Frank',
    'Grace',
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.pink[20],
      child: ListView.builder(
        itemCount: users.length,
        itemBuilder: (context, index) {
          final userName = users[index];
          return ListTile(
            leading: CircleAvatar(
              backgroundColor: Colors.purple[50],
              child: Icon(Icons.person, color: Colors.white),
            ),
            title: Text(
              userName,
              style: TextStyle(
                color: Colors.grey[800],
                fontWeight: FontWeight.w500,
              ),
            ),
            onTap: () {
              if (MediaQuery.of(context).size.width < 600) {
                // Navigate to chat screen for mobile
                Navigator.of(context).pushNamed('/chat/$userName');
              } else if (onUserSelected != null) {
                // Update selected user for desktop
                onUserSelected!(userName);
              }
            },
          );
        },
      ),
    );
  }
}


class ChatDetailScreen extends StatelessWidget {
  final String userName;

  ChatDetailScreen({required this.userName});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.green[50],
      child: Column(
        children: [
          // Chat Header
          Container(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.green[100],
              border: Border(
                bottom: BorderSide(color: Colors.green[200]!),
              ),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundColor: Colors.green[300],
                  child: Icon(Icons.person, color: Colors.white),
                ),
                SizedBox(width: 12),
                Text(
                  userName,
                  style: TextStyle(
                    color: Colors.grey[800],
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
              ],
            ),
          ),
          // Chat Messages
          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.all(16),
              itemCount: 20,
              itemBuilder: (context, index) {
                bool isMe = index % 2 == 0;
                return Align(
                  alignment:
                      isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: EdgeInsets.symmetric(vertical: 4),
                    padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: isMe ? Colors.blue[100] : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      isMe
                          ? "My message $index"
                          : "$userName's message $index",
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey[800],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          // Input Field
          Padding(
            padding: EdgeInsets.all(8),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: "Type a message...",
                      hintStyle: TextStyle(color: Colors.grey[500]),
                      filled: true,
                      fillColor: Colors.grey[100],
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    style: TextStyle(color: Colors.grey[800]),
                  ),
                ),
                SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: Colors.blue[300],
                  child: Icon(Icons.send, color: Colors.white),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

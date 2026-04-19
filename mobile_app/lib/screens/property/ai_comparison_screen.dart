import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:intl/intl.dart';
import '../../providers/property_provider.dart';
import '../../theme/app_theme.dart';

class Message {
  final String id;
  final String role;
  String content;
  final DateTime timestamp;

  Message({
    required this.id,
    required this.role,
    required this.content,
    required this.timestamp,
  });
}

class AIComparisonScreen extends StatefulWidget {
  final String propertyId;
  const AIComparisonScreen({super.key, required this.propertyId});

  @override
  State<AIComparisonScreen> createState() => _AIComparisonScreenState();
}

class _AIComparisonScreenState extends State<AIComparisonScreen> {
  final List<Message> _messages = [];
  final TextEditingController _inputController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isTyping = false;
  String? _propertyType;
  String? _city;

  @override
  void initState() {
    super.initState();
    _initChat();
  }

  void _initChat() {
    final property = context.read<PropertyProvider>().properties.firstWhere((p) => p.id == widget.propertyId);
    _propertyType = property.propertyType;
    _city = property.city;

    _messages.add(Message(
      id: '1',
      role: 'ai',
      content: "Hello! I'm Gemini, your AI Interior Consultant. I've analyzed all received quotations for your property. I can help you compare costs, materials, and timelines to find your perfect design partner.",
      timestamp: DateTime.now(),
    ));

    // Send initial analysis request
    _sendMessage("Provide a detailed comparison of the received quotes for my property.");
  }

  Future<void> _sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    final userMsg = Message(
      id: DateTime.now().toString(),
      role: 'user',
      content: text,
      timestamp: DateTime.now(),
    );

    setState(() {
      _messages.add(userMsg);
      _isTyping = true;
      _scrollToBottom();
    });

    _inputController.clear();

    final aiMsgId = (DateTime.now().millisecondsSinceEpoch + 1).toString();
    final aiMsg = Message(
      id: aiMsgId,
      role: 'ai',
      content: '',
      timestamp: DateTime.now(),
    );

    setState(() {
      _messages.add(aiMsg);
    });

    String fullContent = '';
    try {
      final stream = context.read<PropertyProvider>().getAIComparisonStream(widget.propertyId, text);
      
      await for (final chunk in stream) {
        if (chunk.startsWith('Error:')) {
           fullContent = chunk;
        } else if (chunk != 'established') {
           fullContent += chunk;
        }
        
        if (mounted) {
          setState(() {
            aiMsg.content = fullContent;
            _isTyping = false;
            _scrollToBottom();
          });
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          aiMsg.content = "I encountered a technical glitch while streaming. Please try again.";
        });
      }
    } finally {
      if (mounted) {
        setState(() => _isTyping = false);
      }
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _launchPreview(String html) async {
    final Uri uri = Uri.dataFromString(html, mimeType: 'text/html', encoding: utf8);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Intelligence Console'),
            if (_propertyType != null)
              Text(
                '$_propertyType in $_city',
                style: const TextStyle(fontSize: 10, color: AppTheme.textBody, fontWeight: FontWeight.normal),
              ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(20),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                return _buildMessageBubble(msg);
              },
            ),
          ),
          if (_isTyping)
             const Padding(
               padding: EdgeInsets.all(8.0),
               child: Center(child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.primary)),
             ),
          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Message msg) {
    final isAI = msg.role == 'ai';
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: isAI ? MainAxisAlignment.start : MainAxisAlignment.end,
        children: [
          if (isAI) 
            _buildAvatar(true),
          const SizedBox(width: 12),
          Flexible(
            child: Column(
              crossAxisAlignment: isAI ? CrossAxisAlignment.start : CrossAxisAlignment.end,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: isAI ? AppTheme.surface : AppTheme.primary,
                    borderRadius: BorderRadius.circular(20).copyWith(
                      bottomLeft: isAI ? Radius.zero : const Radius.circular(20),
                      bottomRight: isAI ? const Radius.circular(20) : Radius.zero,
                    ),
                    border: isAI ? Border.all(color: Colors.white.withOpacity(0.05)) : null,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      MarkdownBody(
                        data: msg.content,
                        selectable: true,
                        styleSheet: MarkdownStyleSheet(
                          p: TextStyle(color: isAI ? Colors.white : Colors.white, fontSize: 14, height: 1.5),
                          h1: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold, fontSize: 20),
                          h2: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
                          code: const TextStyle(color: AppTheme.accent, backgroundColor: Colors.transparent),
                          tableHead: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold),
                          tableBorder: TableBorder.all(color: Colors.white12),
                        ),
                      ),
                      if (msg.content.contains('```html')) ...[
                        const SizedBox(height: 16),
                        _buildPreviewButton(msg.content),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  DateFormat('HH:mm').format(msg.timestamp),
                  style: const TextStyle(color: AppTheme.textBody, fontSize: 10),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          if (!isAI) _buildAvatar(false),
        ],
      ),
    );
  }

  Widget _buildAvatar(bool isAI) {
    return Container(
      width: 32,
      height: 32,
      decoration: BoxDecoration(
        gradient: isAI ? const LinearGradient(colors: [Color(0xFF6366f1), Color(0xFFa855f7)]) : null,
        color: !isAI ? AppTheme.surface : null,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Icon(
        isAI ? Icons.psychology_alt : Icons.person,
        size: 18,
        color: Colors.white,
      ),
    );
  }

  Widget _buildPreviewButton(String content) {
    final startIndex = content.indexOf('```html') + 7;
    final endIndex = content.indexOf('```', startIndex);
    final html = (endIndex != -1) ? content.substring(startIndex, endIndex).trim() : '';

    return ElevatedButton.icon(
      onPressed: () => _launchPreview(html),
      icon: const Icon(Icons.play_arrow, size: 16),
      label: const Text('Live Preview', style: TextStyle(fontSize: 12)),
      style: ElevatedButton.styleFrom(
        backgroundColor: AppTheme.primary,
        minimumSize: const Size(0, 36),
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.background,
        border: Border(top: BorderSide(color: Colors.white.withOpacity(0.05))),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _inputController,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Ask Gemini anything...',
                fillColor: AppTheme.surface,
                filled: true,
                contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(30), borderSide: BorderSide.none),
              ),
              onSubmitted: _sendMessage,
            ),
          ),
          const SizedBox(width: 12),
          CircleAvatar(
            backgroundColor: AppTheme.primary,
            child: IconButton(
              icon: const Icon(Icons.send, color: Colors.white, size: 20),
              onPressed: () => _sendMessage(_inputController.text),
            ),
          ),
        ],
      ),
    );
  }
}

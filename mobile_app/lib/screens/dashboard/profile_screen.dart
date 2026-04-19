import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../theme/app_theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          final user = auth.user;
          if (user == null) return const SizedBox.shrink();

          return ListView(
            padding: const EdgeInsets.all(24),
            children: [
              const CircleAvatar(
                radius: 50,
                backgroundColor: AppTheme.primary,
                child: Icon(Icons.person, size: 50, color: Colors.white),
              ),
              const SizedBox(height: 16),
              Text(
                user.name,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 8),
              Container(
                alignment: Alignment.center,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    user.role,
                    style: const TextStyle(
                      color: AppTheme.primary,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 32),
              ListTile(
                leading: const Icon(Icons.email, color: AppTheme.textBody),
                title: const Text('Email Address', style: TextStyle(color: AppTheme.textBody, fontSize: 12)),
                subtitle: Text(user.email, style: const TextStyle(color: Colors.white, fontSize: 16)),
              ),
              const Divider(color: Colors.white10),
              ListTile(
                leading: const Icon(Icons.privacy_tip, color: AppTheme.textBody),
                title: const Text('Privacy Policy', style: TextStyle(color: Colors.white)),
                trailing: const Icon(Icons.chevron_right, color: AppTheme.textBody),
                onTap: () {},
              ),
              const Divider(color: Colors.white10),
              ListTile(
                leading: const Icon(Icons.help_outline, color: AppTheme.textBody),
                title: const Text('Help & Support', style: TextStyle(color: Colors.white)),
                trailing: const Icon(Icons.chevron_right, color: AppTheme.textBody),
                onTap: () {},
              ),
              const SizedBox(height: 48),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.redAccent.withOpacity(0.1),
                  foregroundColor: Colors.redAccent,
                ),
                icon: const Icon(Icons.logout),
                label: const Text('Logout'),
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      backgroundColor: AppTheme.surface,
                      title: const Text('Logout', style: TextStyle(color: Colors.white)),
                      content: const Text('Are you sure you want to log out?', style: TextStyle(color: AppTheme.textBody)),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('Cancel', style: TextStyle(color: AppTheme.textBody)),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.pop(context);
                            auth.logout();
                          },
                          child: const Text('Logout', style: TextStyle(color: Colors.redAccent)),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          );
        },
      ),
    );
  }
}

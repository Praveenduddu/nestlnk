import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/dashboard/main_layout.dart';
import '../screens/property/property_details_screen.dart';
import '../screens/property/ai_comparison_screen.dart';
import '../screens/property/edit_property_screen.dart';
import '../theme/app_theme.dart';

class AppRouter {
  static GoRouter createRouter(AuthProvider authProvider) {
    return GoRouter(
      initialLocation: '/splash',
      refreshListenable: authProvider,
      redirect: (context, state) {
        final isAuthRoute = state.uri.path == '/login' || state.uri.path == '/register';
        final isSplashRoute = state.uri.path == '/splash';

        if (authProvider.isLoading) {
          return isSplashRoute ? null : '/splash';
        }

        if (!authProvider.isAuthenticated && !isAuthRoute) {
          return '/login';
        }

        if (authProvider.isAuthenticated && (isAuthRoute || isSplashRoute)) {
          return '/';
        }

        return null;
      },
      routes: [
        GoRoute(
          path: '/splash',
          builder: (context, state) => const Scaffold(
            backgroundColor: AppTheme.background,
            body: Center(
              child: CircularProgressIndicator(color: AppTheme.primary),
            ),
          ),
        ),
        GoRoute(
          path: '/login',
          builder: (context, state) => const LoginScreen(),
        ),
        GoRoute(
          path: '/register',
          builder: (context, state) => const RegisterScreen(),
        ),
        GoRoute(
          path: '/',
          builder: (context, state) => const MainLayout(),
        ),
        GoRoute(
          path: '/property/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return PropertyDetailsScreen(propertyId: id);
          },
        ),
        GoRoute(
          path: '/property/:id/ai-compare',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return AIComparisonScreen(propertyId: id);
          },
        ),
        GoRoute(
          path: '/property/:id/edit',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return EditPropertyScreen(propertyId: id);
          },
        ),
      ],
    );
  }
}


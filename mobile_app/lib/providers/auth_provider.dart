import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/api_client.dart';
import '../models/user.dart';

class AuthProvider with ChangeNotifier {
  final ApiClient _apiClient = ApiClient();
  User? _user;
  bool _isLoading = true;

  User? get user => _user;
  bool get isAuthenticated => _user != null;
  bool get isLoading => _isLoading;

  AuthProvider() {
    _loadUser();
  }

  Future<void> _loadUser() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    
    if (token != null) {
      try {
        final response = await _apiClient.dio.get('/auth/me');
        _user = User.fromJson(response.data);
      } catch (e) {
        // Token might be invalid/expired, interceptor tries to refresh,
        // if it still fails, we log out.
        await logout();
      }
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    try {
      final response = await _apiClient.dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      if (response.data['role'] != 'CUSTOMER') {
        throw Exception('Access denied. Only customers can login to this app.');
      }

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', response.data['token']);
      await prefs.setString('refreshToken', response.data['refreshToken']);
      
      _user = User(
        id: response.data['userId'],
        name: response.data['name'],
        email: response.data['email'],
        role: response.data['role'],
      );
      
      notifyListeners();
      return true;
    } catch (e) {
      rethrow;
    }
  }

  Future<bool> register(String name, String email, String password) async {
    try {
      final response = await _apiClient.dio.post('/auth/register', data: {
        'name': name,
        'email': email,
        'password': password,
        'role': 'CUSTOMER',
      });
      return true;
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('refreshToken');
    _user = null;
    notifyListeners();
  }
}

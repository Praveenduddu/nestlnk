import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'app_config.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  late Dio dio;

  factory ApiClient() {
    return _instance;
  }

  ApiClient._internal() {
    dio = Dio(BaseOptions(
      baseUrl: AppConfig.baseUrl, 
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException e, handler) async {
        if (e.response?.statusCode == 401 && e.response?.data?['error'] == 'Token expired') {
          // Attempt token refresh
          if (await _refreshToken()) {
            final prefs = await SharedPreferences.getInstance();
            final newToken = prefs.getString('token');
            e.requestOptions.headers['Authorization'] = 'Bearer $newToken';
            // Retry the request
            final retryResponse = await dio.fetch(e.requestOptions);
            return handler.resolve(retryResponse);
          }
        }
        return handler.next(e);
      },
    ));
  }

  Future<bool> _refreshToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final refreshToken = prefs.getString('refreshToken');
      if (refreshToken == null) return false;

      final response = await dio.post('/auth/refresh', data: {
        'refreshToken': refreshToken,
      });

      if (response.statusCode == 200) {
        final data = response.data;
        await prefs.setString('token', data['token']);
        await prefs.setString('refreshToken', data['refreshToken']);
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }
}

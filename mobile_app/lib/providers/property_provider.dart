import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../core/api_client.dart';
import '../models/property_brief.dart';
import '../models/quotation.dart';

class PropertyProvider with ChangeNotifier {
  final ApiClient _apiClient = ApiClient();
  
  List<PropertyBrief> _properties = [];
  bool _isLoading = false;

  List<PropertyBrief> get properties => _properties;
  bool get isLoading => _isLoading;

  Future<void> fetchMyProperties() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiClient.dio.get('/properties/my');
      _properties = (response.data as List)
          .map((json) => PropertyBrief.fromJson(json))
          .toList();
    } catch (e) {
      debugPrint('Error fetching properties: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<List<Quotation>> fetchQuotes(String propertyId) async {
    try {
      final response = await _apiClient.dio.get('/properties/$propertyId/quotes');
      return (response.data as List)
          .map((json) => Quotation.fromJson(json))
          .toList();
    } catch (e) {
      debugPrint('Error fetching quotes: $e');
      return [];
    }
  }

  Future<bool> shortlistFirm(String propertyId, String firmId) async {
    try {
      await _apiClient.dio.post('/properties/$propertyId/shortlist', data: {
        'firmId': firmId,
      });
      // Refresh properties to reflect status change
      await fetchMyProperties();
      return true;
    } catch (e) {
      debugPrint('Error shortlisting firm: $e');
      return false;
    }
  }

  Future<bool> postProperty(Map<String, dynamic> data) async {
    try {
      await _apiClient.dio.post('/properties', data: data);
      await fetchMyProperties();
      return true;
    } catch (e) {
      debugPrint('Error posting property: $e');
      return false;
    }
  }

  Future<bool> updateProperty(String id, Map<String, dynamic> data) async {
    try {
      await _apiClient.dio.put('/properties/$id', data: data);
      await fetchMyProperties();
      return true;
    } catch (e) {
      debugPrint('Error updating property: $e');
      return false;
    }
  }

  Future<bool> closeProperty(String id) async {
    try {
      await _apiClient.dio.post('/properties/$id/close');
      await fetchMyProperties();
      return true;
    } catch (e) {
      debugPrint('Error closing property: $e');
      return false;
    }
  }

  Stream<String> getAIComparisonStream(String propertyId, String question) async* {
    try {
      final response = await _apiClient.dio.post(
        '/properties/$propertyId/ai-compare',
        data: {'question': question},
        options: Options(responseType: ResponseType.stream),
      );

      final stream = response.data.stream;
      await for (final chunk in stream) {
        final decoded = String.fromCharCodes(chunk);
        // SSE parsing logic: look for "data: " prefix
        final lines = decoded.split('\n');
        for (final line in lines) {
          if (line.startsWith('data:')) {
            yield line.substring(5).trim();
          }
        }
      }
    } catch (e) {
      debugPrint('Error in AI streaming: $e');
      yield 'Error: Failed to connect to AI engine.';
    }
  }
}

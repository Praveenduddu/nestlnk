import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/property_provider.dart';
import '../../theme/app_theme.dart';

class PostBriefScreen extends StatefulWidget {
  const PostBriefScreen({super.key});

  @override
  State<PostBriefScreen> createState() => _PostBriefScreenState();
}

class _PostBriefScreenState extends State<PostBriefScreen> {
  final _formKey = GlobalKey<FormState>();
  String _propertyType = 'Apartment';
  final _cityController = TextEditingController();
  final _sizeController = TextEditingController();
  final _budgetMinController = TextEditingController();
  final _budgetMaxController = TextEditingController();
  String _timeline = '1-3 months';
  final _scopeController = TextEditingController();
  bool _isSubmitting = false;

  final List<String> _propertyTypes = ['Apartment', 'Villa', 'Independent House', 'Office Space', 'Retail Store', 'Restaurant / Cafe', 'Clinic / Hospital', 'Other'];
  final List<String> _timelines = ['Immediate (Under 1 month)', '1-3 months', '3-6 months', '6+ months', 'Flexible'];

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _isSubmitting = true);

    final data = {
      'propertyType': _propertyType,
      'city': _cityController.text.trim(),
      'sizeSqft': int.parse(_sizeController.text.trim()),
      'budgetMin': int.parse(_budgetMinController.text.trim()),
      'budgetMax': int.parse(_budgetMaxController.text.trim()),
      'timeline': _timeline,
      'scope': _scopeController.text.trim(),
    };

    final success = await context.read<PropertyProvider>().postProperty(data);
    
    if (mounted) {
      setState(() => _isSubmitting = false);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Property brief posted successfully!')));
        _formKey.currentState!.reset();
        _cityController.clear();
        _sizeController.clear();
        _budgetMinController.clear();
        _budgetMaxController.clear();
        _scopeController.clear();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to post brief.')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Post New Brief'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            const Text('Property Details', style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _propertyType,
              decoration: const InputDecoration(labelText: 'Property Type'),
              dropdownColor: AppTheme.surface,
              items: _propertyTypes.map((t) => DropdownMenuItem(value: t, child: Text(t, style: const TextStyle(color: Colors.white)))).toList(),
              onChanged: (val) => setState(() => _propertyType = val!),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _cityController,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(labelText: 'City'),
              validator: (v) => v!.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _sizeController,
              keyboardType: TextInputType.number,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(labelText: 'Size (sqft)', suffixText: 'sqft'),
              validator: (v) => v!.isEmpty ? 'Required' : null,
            ),
            
            const SizedBox(height: 32),
            const Text('Budget & Timeline', style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _budgetMinController,
                    keyboardType: TextInputType.number,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(labelText: 'Min Budget', prefixText: '₹'),
                    validator: (v) => v!.isEmpty ? 'Required' : null,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: TextFormField(
                    controller: _budgetMaxController,
                    keyboardType: TextInputType.number,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(labelText: 'Max Budget', prefixText: '₹'),
                    validator: (v) => v!.isEmpty ? 'Required' : null,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _timeline,
              decoration: const InputDecoration(labelText: 'Timeline'),
              dropdownColor: AppTheme.surface,
              items: _timelines.map((t) => DropdownMenuItem(value: t, child: Text(t, style: const TextStyle(color: Colors.white)))).toList(),
              onChanged: (val) => setState(() => _timeline = val!),
            ),

            const SizedBox(height: 32),
            const Text('Scope of Work', style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            TextFormField(
              controller: _scopeController,
              maxLines: 4,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                labelText: 'Describe your requirements...',
                alignLabelWithHint: true,
              ),
              validator: (v) => v!.isEmpty ? 'Required' : null,
            ),

            const SizedBox(height: 48),
            ElevatedButton(
              onPressed: _isSubmitting ? null : _submit,
              child: _isSubmitting 
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                  : const Text('Submit Brief'),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

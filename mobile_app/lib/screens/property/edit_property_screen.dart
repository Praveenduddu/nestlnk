import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/property_provider.dart';
import '../../theme/app_theme.dart';

class EditPropertyScreen extends StatefulWidget {
  final String propertyId;
  const EditPropertyScreen({super.key, required this.propertyId});

  @override
  State<EditPropertyScreen> createState() => _EditPropertyScreenState();
}

class _EditPropertyScreenState extends State<EditPropertyScreen> {
  final _formKey = GlobalKey<FormState>();
  late String _propertyType;
  late TextEditingController _cityController;
  late TextEditingController _sizeController;
  late TextEditingController _budgetMinController;
  late TextEditingController _budgetMaxController;
  late String _timeline;
  late TextEditingController _scopeController;
  bool _isInitializing = true;
  bool _isSubmitting = false;

  final List<String> _propertyTypes = [
    'Apartment', 'Villa', 'Independent House', 'Office Space', 
    'Retail Store', 'Restaurant / Cafe', 'Clinic / Hospital', 'Other'
  ];
  final List<String> _timelines = [
    'Immediate (Under 1 month)', '1-3 months', '3-6 months', '6+ months', 'Flexible'
  ];

  @override
  void initState() {
    super.initState();
    _initData();
  }

  void _initData() {
    final provider = context.read<PropertyProvider>();
    final property = provider.properties.firstWhere((p) => p.id == widget.propertyId);
    
    _propertyType = property.propertyType;
    _cityController = TextEditingController(text: property.city);
    _sizeController = TextEditingController(text: property.sizeSqft.toString());
    _budgetMinController = TextEditingController(text: property.budgetMin.toInt().toString());
    _budgetMaxController = TextEditingController(text: property.budgetMax.toInt().toString());
    _timeline = property.timeline;
    _scopeController = TextEditingController(text: property.scope);
    
    setState(() => _isInitializing = false);
  }

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

    final success = await context.read<PropertyProvider>().updateProperty(widget.propertyId, data);
    
    if (mounted) {
      setState(() => _isSubmitting = false);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Property brief updated!')));
        context.pop();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to update brief.')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isInitializing) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Brief'),
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
                  : const Text('Save Changes'),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

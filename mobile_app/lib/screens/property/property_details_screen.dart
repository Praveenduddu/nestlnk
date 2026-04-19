import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../providers/property_provider.dart';
import '../../core/app_config.dart';
import '../../models/quotation.dart';
import '../../theme/app_theme.dart';

class PropertyDetailsScreen extends StatefulWidget {
  final String propertyId;
  const PropertyDetailsScreen({super.key, required this.propertyId});

  @override
  State<PropertyDetailsScreen> createState() => _PropertyDetailsScreenState();
}

class _PropertyDetailsScreenState extends State<PropertyDetailsScreen> {
  List<Quotation> _quotes = [];
  bool _isLoading = true;
  bool _isShortlisting = false;

  @override
  void initState() {
    super.initState();
    _loadQuotes();
  }

  Future<void> _loadQuotes() async {
    final quotes = await context.read<PropertyProvider>().fetchQuotes(widget.propertyId);
    if (mounted) {
      setState(() {
        _quotes = quotes;
        // Sort by estimated cost ascending
        _quotes.sort((a, b) => a.estimatedCost.compareTo(b.estimatedCost));
        _isLoading = false;
      });
    }
  }

  Future<void> _shortlistFirm(String firmId) async {
    setState(() => _isShortlisting = true);
    final success = await context.read<PropertyProvider>().shortlistFirm(widget.propertyId, firmId);
    
    if (mounted) {
      setState(() => _isShortlisting = false);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Firm shortlisted successfully!')));
        _loadQuotes(); // reload quotes to reflect status
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to shortlist firm.')));
      }
    }
  }

  Future<void> _showCloseConfirmation() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Close Brief?'),
        content: const Text('Are you sure you want to close this property brief? Firms will no longer be able to submit quotes.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('No')),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent, padding: const EdgeInsets.symmetric(horizontal: 16)),
            child: const Text('Yes, Close IT'),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      final success = await context.read<PropertyProvider>().closeProperty(widget.propertyId);
      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Property brief closed.')));
        _loadQuotes(); // reload to show status change
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final propertyProvider = context.read<PropertyProvider>();
    final property = propertyProvider.properties.firstWhere(
      (p) => p.id == widget.propertyId,
      orElse: () => throw Exception('Property not found'),
    );

    final formatCurrency = NumberFormat.compactCurrency(symbol: '₹', decimalDigits: 2);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Property Leads'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        actions: [
          if (property.status == 'OPEN') ...[
            IconButton(
              icon: const Icon(Icons.edit_outlined),
              tooltip: 'Edit Brief',
              onPressed: () => context.push('/property/${widget.propertyId}/edit'),
            ),
            IconButton(
              icon: const Icon(Icons.cancel_outlined),
              tooltip: 'Close Brief',
              onPressed: () => _showCloseConfirmation(),
            ),
          ],
        ],
      ),
      floatingActionButton: _quotes.isNotEmpty 
          ? FloatingActionButton.extended(
              onPressed: () => context.push('/property/${widget.propertyId}/ai-compare'),
              label: const Text('Compare with AI'),
              icon: const Icon(Icons.auto_awesome),
              backgroundColor: AppTheme.primary,
            )
          : null,
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                   Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AppTheme.surface,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.white.withOpacity(0.05)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: property.status == 'OPEN' ? Colors.greenAccent.withOpacity(0.1) : Colors.amber.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                property.status,
                                style: TextStyle(
                                  color: property.status == 'OPEN' ? Colors.greenAccent : Colors.amber,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            Text(
                              '${property.sizeSqft} sqft',
                              style: const TextStyle(color: AppTheme.textBody, fontSize: 12),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text('${property.propertyType} in ${property.city}', style: Theme.of(context).textTheme.titleLarge),
                        const SizedBox(height: 8),
                         Text(
                          '${formatCurrency.format(property.budgetMin)} - ${formatCurrency.format(property.budgetMax)}',
                          style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  Text('Quotations (${_quotes.length})', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
          
          if (_quotes.isEmpty)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(48.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.hourglass_empty, size: 48, color: AppTheme.textBody),
                    const SizedBox(height: 16),
                    Text('No quotes yet', style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 8),
                    const Text('Design firms will submit their proposals soon.', textAlign: TextAlign.center, style: TextStyle(color: AppTheme.textBody, fontSize: 12)),
                  ],
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0).copyWith(bottom: 24),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final q = _quotes[index];
                    final isLowest = index == 0 && property.status == 'OPEN';

                    return Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: AppTheme.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: q.status == 'SHORTLISTED' 
                              ? Colors.greenAccent.withOpacity(0.3) 
                              : isLowest 
                                  ? AppTheme.primary.withOpacity(0.3) 
                                  : Colors.white.withOpacity(0.05),
                          width: (q.status == 'SHORTLISTED' || isLowest) ? 2 : 1,
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    CircleAvatar(
                                      backgroundColor: AppTheme.primary.withOpacity(0.2),
                                      child: Text(
                                        (q.firmCompany.isNotEmpty ? q.firmCompany[0] : q.firmName[0]).toUpperCase(),
                                        style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          q.firmCompany.isNotEmpty ? q.firmCompany : q.firmName,
                                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                                        ),
                                        if (isLowest)
                                          const Text('Lowest Cost', style: TextStyle(color: Colors.greenAccent, fontSize: 10, fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  ],
                                ),
                                Text(
                                  formatCurrency.format(q.estimatedCost),
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                                ),
                              ],
                            ),
                            const Divider(color: Colors.white10, height: 32),
                            if (q.pdfUrl != null && q.pdfUrl!.isNotEmpty) ...[
                              OutlinedButton.icon(
                                onPressed: () async {
                                  final fullUrl = q.pdfUrl!.startsWith('http') 
                                      ? q.pdfUrl! 
                                      : '${AppConfig.serverUrl}${q.pdfUrl}';
                                  final uri = Uri.parse(fullUrl);
                                  if (await canLaunchUrl(uri)) {
                                    await launchUrl(uri, mode: LaunchMode.externalApplication);
                                  } else {
                                    if (mounted) {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(content: Text('Could not open proposal: $fullUrl')),
                                      );
                                    }
                                  }
                                },
                                icon: const Icon(Icons.picture_as_pdf, size: 16),
                                label: const Text('View Proposal', style: TextStyle(fontSize: 12)),
                                style: OutlinedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                  side: const BorderSide(color: Colors.white12),
                                  foregroundColor: Colors.white70,
                                ),
                              ),
                              const SizedBox(height: 16),
                            ],
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text('Timeline', style: TextStyle(color: AppTheme.textBody, fontSize: 10)),
                                    Text(q.timeline, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                                  ],
                                ),
                                if (q.status == 'SHORTLISTED')
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                    decoration: BoxDecoration(
                                      color: Colors.greenAccent.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Row(
                                      children: [
                                        Icon(Icons.check_circle, color: Colors.greenAccent, size: 14),
                                        SizedBox(width: 4),
                                        Text('Shortlisted', style: TextStyle(color: Colors.greenAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  )
                                else if (property.status != 'OPEN')
                                  const Text('Not Selected', style: TextStyle(color: AppTheme.textBody, fontSize: 12, fontWeight: FontWeight.bold))
                                else
                                  ElevatedButton(
                                    onPressed: _isShortlisting ? null : () => _shortlistFirm(q.firmId),
                                    style: ElevatedButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 0),
                                      minimumSize: const Size(0, 36),
                                      textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                                    ),
                                    child: _isShortlisting 
                                        ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                        : const Text('Shortlist'),
                                  )
                              ],
                            )
                          ],
                        ),
                      ),
                    );
                  },
                  childCount: _quotes.length,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

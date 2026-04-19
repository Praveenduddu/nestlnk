import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../providers/property_provider.dart';
import '../../theme/app_theme.dart';

class CustomerDashboardScreen extends StatefulWidget {
  const CustomerDashboardScreen({super.key});

  @override
  State<CustomerDashboardScreen> createState() => _CustomerDashboardScreenState();
}

class _CustomerDashboardScreenState extends State<CustomerDashboardScreen> {
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    await context.read<PropertyProvider>().fetchMyProperties();
    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Consumer2<AuthProvider, PropertyProvider>(
      builder: (context, auth, propertyProvider, _) {
        final user = auth.user;
        final properties = propertyProvider.properties;
        final activeBriefs = properties.where((p) => p.status == 'OPEN').length;
        final totalQuotes = properties.fold<int>(0, (sum, p) => sum + (p.quoteCount));

        return Scaffold(
          body: CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 120,
                floating: true,
                flexibleSpace: FlexibleSpaceBar(
                  title: Text('Welcome, ${user?.name}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  background: Container(color: AppTheme.background),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildStatsRow(properties.length, activeBriefs, totalQuotes),
                      const SizedBox(height: 32),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Recent Properties', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                          TextButton(
                            onPressed: () => DefaultTabController.of(context).animateTo(1), // Go to Properties tab
                            child: const Text('View All'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      if (properties.isEmpty)
                        _buildEmptyState()
                      else
                        ...properties.take(3).map((p) => _buildPropertyCard(p)),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildStatsRow(int total, int active, int quotes) {
    return Row(
      children: [
        _buildStatCard('Total', total.toString(), Icons.home_work, Colors.indigoAccent),
        const SizedBox(width: 12),
        _buildStatCard('Active', active.toString(), Icons.feed, Colors.greenAccent),
        const SizedBox(width: 12),
        _buildStatCard('Quotes', quotes.toString(), Icons.request_quote, Colors.amberAccent),
      ],
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white.withOpacity(0.05)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(height: 12),
            Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
            Text(label, style: const TextStyle(fontSize: 10, color: AppTheme.textBody)),
          ],
        ),
      ),
    );
  }

  Widget _buildPropertyCard(dynamic p) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        onTap: () => context.push('/property/${p.id}'),
        title: Text(p.propertyType, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        subtitle: Text(p.city, style: const TextStyle(color: AppTheme.textBody)),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: p.status == 'OPEN' ? Colors.greenAccent.withOpacity(0.1) : Colors.amber.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            p.status,
            style: TextStyle(
              color: p.status == 'OPEN' ? Colors.greenAccent : Colors.amber,
              fontSize: 10,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        children: [
          const SizedBox(height: 40),
          Icon(Icons.home_work_outlined, size: 64, color: Colors.white.withOpacity(0.2)),
          const SizedBox(height: 16),
          const Text('No properties yet', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          const Text('Add your first property to get started', style: TextStyle(color: AppTheme.textBody)),
        ],
      ),
    );
  }
}

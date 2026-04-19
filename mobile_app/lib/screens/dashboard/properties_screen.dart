import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/property_provider.dart';
import '../../theme/app_theme.dart';
import 'package:intl/intl.dart';

class PropertiesScreen extends StatefulWidget {
  const PropertiesScreen({super.key});

  @override
  State<PropertiesScreen> createState() => _PropertiesScreenState();
}

class _PropertiesScreenState extends State<PropertiesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PropertyProvider>().fetchMyProperties();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Properties'),
      ),
      body: Consumer<PropertyProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (provider.properties.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.home_work_outlined, size: 64, color: AppTheme.textBody),
                  const SizedBox(height: 16),
                  Text('No properties yet', style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 8),
                  const Text('Post a brief to get started.', style: TextStyle(color: AppTheme.textBody)),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => provider.fetchMyProperties(),
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: provider.properties.length,
              separatorBuilder: (context, index) => const SizedBox(height: 16),
              itemBuilder: (context, index) {
                final property = provider.properties[index];
                
                Color statusColor;
                switch (property.status) {
                  case 'OPEN': statusColor = Colors.greenAccent; break;
                  case 'SHORTLISTED': statusColor = Colors.amber; break;
                  case 'CLOSED': statusColor = Colors.grey; break;
                  default: statusColor = Colors.blue;
                }

                final formatCurrency = NumberFormat.compactCurrency(symbol: '₹', decimalDigits: 1);

                return Card(
                  child: InkWell(
                    borderRadius: BorderRadius.circular(16),
                    onTap: () => context.push('/property/${property.id}'),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: statusColor.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  property.status,
                                  style: TextStyle(color: statusColor, fontSize: 12, fontWeight: FontWeight.bold),
                                ),
                              ),
                              Text(
                                '${property.quoteCount} Quotes',
                                style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Text(
                            '${property.propertyType} in ${property.city}',
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Budget', style: TextStyle(color: AppTheme.textBody, fontSize: 12)),
                                  Text(
                                    '${formatCurrency.format(property.budgetMin)} - ${formatCurrency.format(property.budgetMax)}',
                                    style: const TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  const Text('Size', style: TextStyle(color: AppTheme.textBody, fontSize: 12)),
                                  Text(
                                    '${property.sizeSqft} sqft',
                                    style: const TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                            ],
                          )
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}

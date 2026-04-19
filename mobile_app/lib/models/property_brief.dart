class PropertyBrief {
  final String id;
  final String propertyType;
  final String city;
  final int sizeSqft;
  final int budgetMin;
  final int budgetMax;
  final String timeline;
  final String scope;
  final String status;
  final String createdAt;
  final int quoteCount;
  final List<String> imageUrls;
  final String? customerName;

  PropertyBrief({
    required this.id,
    required this.propertyType,
    required this.city,
    required this.sizeSqft,
    required this.budgetMin,
    required this.budgetMax,
    required this.timeline,
    required this.scope,
    required this.status,
    required this.createdAt,
    required this.quoteCount,
    required this.imageUrls,
    this.customerName,
  });

  factory PropertyBrief.fromJson(Map<String, dynamic> json) {
    return PropertyBrief(
      id: json['id']?.toString() ?? '',
      propertyType: json['propertyType']?.toString() ?? '',
      city: json['city']?.toString() ?? '',
      sizeSqft: (json['sizeSqft'] as num?)?.toInt() ?? 0,
      budgetMin: (json['budgetMin'] as num?)?.toInt() ?? 0,
      budgetMax: (json['budgetMax'] as num?)?.toInt() ?? 0,
      timeline: json['timeline']?.toString() ?? '',
      scope: json['scope']?.toString() ?? '',
      status: json['status']?.toString() ?? 'OPEN',
      createdAt: json['createdAt']?.toString() ?? '',
      quoteCount: (json['quoteCount'] as num?)?.toInt() ?? 0,
      imageUrls: List<String>.from(json['imageUrls'] ?? []),
      customerName: json['customerName']?.toString(),
    );
  }
}

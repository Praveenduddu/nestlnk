class Quotation {
  final String id;
  final String propertyId;
  final String propertyBriefId;
  final String propertyType;
  final String city;
  final String firmId;
  final String firmName;
  final String firmCompany;
  final double estimatedCost;
  final double designCost;
  final double materialCost;
  final double laborCost;
  final double otherCost;
  final String timeline;
  final String? coverNote;
  final String? pdfUrl;
  final String status;
  final String createdAt;
  final String? customerName;
  final String? customerEmail;
  final String? customerPhone;

  Quotation({
    required this.id,
    required this.propertyId,
    required this.propertyBriefId,
    required this.propertyType,
    required this.city,
    required this.firmId,
    required this.firmName,
    required this.firmCompany,
    required this.estimatedCost,
    required this.designCost,
    required this.materialCost,
    required this.laborCost,
    required this.otherCost,
    required this.timeline,
    this.coverNote,
    this.pdfUrl,
    required this.status,
    required this.createdAt,
    this.customerName,
    this.customerEmail,
    this.customerPhone,
  });

  factory Quotation.fromJson(Map<String, dynamic> json) {
    return Quotation(
      id: json['id']?.toString() ?? '',
      propertyId: json['propertyId']?.toString() ?? '',
      propertyBriefId: json['propertyBriefId']?.toString() ?? '',
      propertyType: json['propertyType']?.toString() ?? '',
      city: json['city']?.toString() ?? '',
      firmId: json['firmId']?.toString() ?? '',
      firmName: json['firmName']?.toString() ?? '',
      firmCompany: json['firmCompany']?.toString() ?? '',
      estimatedCost: (json['estimatedCost'] as num?)?.toDouble() ?? 0,
      designCost: (json['designCost'] as num?)?.toDouble() ?? 0,
      materialCost: (json['materialCost'] as num?)?.toDouble() ?? 0,
      laborCost: (json['laborCost'] as num?)?.toDouble() ?? 0,
      otherCost: (json['otherCost'] as num?)?.toDouble() ?? 0,
      timeline: json['timeline']?.toString() ?? '',
      coverNote: json['coverNote']?.toString(),
      pdfUrl: json['pdfUrl']?.toString(),
      status: json['status']?.toString() ?? 'SUBMITTED',
      createdAt: json['createdAt']?.toString() ?? '',
      customerName: json['customerName']?.toString(),
      customerEmail: json['customerEmail']?.toString(),
      customerPhone: json['customerPhone']?.toString(),
    );
  }
}

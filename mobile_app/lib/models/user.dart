class User {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? companyName;
  final String? phone;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.companyName,
    this.phone,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? '',
      companyName: json['companyName'],
      phone: json['phone'],
    );
  }
}

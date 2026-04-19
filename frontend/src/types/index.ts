export interface User {
    id: string;
    name: string;
    email: string;
    role: 'CUSTOMER' | 'FIRM' | 'ADMIN';
    companyName?: string;
    phone?: string;
    verified: boolean;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    role: string;
    name: string;
    email: string;
    userId: string;
    companyName?: string;
    phone?: string;
    verified?: boolean;
    hasGeminiKey?: boolean;
}

export interface PropertyBrief {
    id: string;
    propertyType: string;
    city: string;
    sizeSqft: number;
    budgetMin: number;
    budgetMax: number;
    timeline: string;
    scope: string;
    status: 'OPEN' | 'CLOSED' | 'SHORTLISTED';
    createdAt: string;
    quoteCount: number;
    imageUrls: string[];
    customerName?: string;
    targetedFirmIds?: string[];
}

export interface Quotation {
    id: string;
    propertyId: string;
    propertyBriefId: string;
    propertyType: string;
    city: string;
    firmId: string;
    firmName: string;
    firmCompany: string;
    estimatedCost: number;
    designCost: number;
    materialCost: number;
    laborCost: number;
    otherCost: number;
    timeline: string;
    coverNote?: string;
    pdfUrl?: string;
    status: 'SUBMITTED' | 'SHORTLISTED' | 'REJECTED' | 'WITHDRAWN';
    propertyStatus?: string;
    createdAt: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
}

export interface Analytics {
    totalCustomers: number;
    totalFirms: number;
    verifiedFirms: number;
    totalProperties: number;
    openProperties: number;
    totalQuotations: number;
}

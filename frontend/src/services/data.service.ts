import api from './api';
import type { PropertyBrief, Quotation } from '../types';

export const propertyService = {
    async create(data: FormData): Promise<PropertyBrief> {
        const response = await api.post('/properties', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async getMyProperties(): Promise<PropertyBrief[]> {
        const response = await api.get('/properties/my');
        return response.data;
    },

    async getById(id: string): Promise<PropertyBrief> {
        const response = await api.get(`/properties/${id}`);
        return response.data;
    },

    async getOpenProperties(): Promise<PropertyBrief[]> {
        const response = await api.get('/properties/open');
        return response.data;
    },

    async closeProperty(id: string): Promise<void> {
        await api.put(`/properties/${id}/close`);
    },

    async updateProperty(id: string, data: Partial<PropertyBrief>): Promise<PropertyBrief> {
        const response = await api.put(`/properties/${id}`, data);
        return response.data;
    },

    async getQuotes(propertyId: string): Promise<Quotation[]> {
        const response = await api.get(`/properties/${propertyId}/quotes`);
        return response.data;
    },

    async shortlistFirm(propertyId: string, firmId: string): Promise<void> {
        await api.post(`/properties/${propertyId}/shortlist`, { firmId });
    },

    async getVerifiedFirms(): Promise<{ id: string; name: string; companyName: string; email: string; phone: string }[]> {
        const response = await api.get('/properties/firms/list');
        return response.data;
    },

    async assignFirms(propertyId: string, firmIds: string[]): Promise<void> {
        await api.post(`/properties/${propertyId}/assign-firms`, { firmIds });
    },

    async aiCompare(id: string, question: string): Promise<string> {
        const response = await api.post(`/properties/${id}/ai-compare`, { question });
        return response.data.response;
    },

    async *aiCompareStream(id: string, question: string): AsyncIterableIterator<string> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/properties/${id}/ai-compare`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ question })
        });

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader available');

        const decoder = new TextDecoder();
        let buffer = '';
        let eventData: string[] = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data:')) {
                    const content = line.startsWith('data: ') ? line.substring(6) : line.substring(5);
                    eventData.push(content);
                } else if (line.trim() === '') {
                    if (eventData.length > 0) {
                        yield eventData.join('\n');
                        eventData = [];
                    }
                }
            }
        }
        
        if (eventData.length > 0) {
            yield eventData.join('\n');
        }
    },
};

export const quotationService = {
    async submit(data: FormData): Promise<Quotation> {
        const response = await api.post('/quotes', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async getMyQuotes(): Promise<Quotation[]> {
        const response = await api.get('/quotes/my');
        return response.data;
    },
};

export const firmService = {
    async getOpenBriefs(): Promise<PropertyBrief[]> {
        const response = await api.get('/properties/open');
        return response.data;
    },

    async getWithdrawnBriefs(): Promise<PropertyBrief[]> {
        const response = await api.get('/properties/firm/withdrawn');
        return response.data;
    },

    async submitQuote(data: FormData): Promise<Quotation> {
        const response = await api.post('/quotes', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async getLeadById(id: string): Promise<PropertyBrief> {
        const response = await api.get(`/properties/${id}`);
        return response.data;
    },

    async getMyQuotes(): Promise<Quotation[]> {
        const response = await api.get('/quotes/my');
        return response.data;
    },
};

export const adminService = {
    async getStats() {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    async getFirms() {
        const response = await api.get('/admin/firms');
        return response.data;
    },

    async getAllFirms() {
        const response = await api.get('/admin/firms');
        return response.data;
    },

    async getUsers() {
        const response = await api.get('/admin/users');
        return response.data;
    },

    async getAllUsers() {
        const response = await api.get('/admin/users');
        return response.data;
    },

    async verifyFirm(firmId: string) {
        await api.put(`/admin/verify/${firmId}`);
    },

    async deleteUser(id: string) {
        await api.delete(`/admin/users/${id}`);
    },

    async getAllProperties(): Promise<PropertyBrief[]> {
        const response = await api.get('/admin/properties');
        return response.data;
    },

    async deleteProperty(id: string) {
        await api.delete(`/admin/property/${id}`);
    },

    async getAllQuotes(): Promise<Quotation[]> {
        const response = await api.get('/admin/quotes');
        return response.data;
    },

    async getAnalytics() {
        const response = await api.get('/admin/analytics');
        return response.data;
    },
};

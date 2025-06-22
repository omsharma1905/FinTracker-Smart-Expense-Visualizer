const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface Transaction {
  _id?: string;
  type: 'credit' | 'debit';
  amount: number;
  category: 'food' | 'travel' | 'billing' | 'others';
  description: string;
  timestamp: string;
}

export interface TransactionStats {
  totalCredits: number;
  totalDebits: number;
  netBalance: number;
}

class ApiService {
  private async handleResponse(response: Response) {
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    return this.handleResponse(response);
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`);
    return this.handleResponse(response);
  }

  async createTransaction(transaction: Omit<Transaction, '_id'>): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });
    return this.handleResponse(response);
  }

  async updateTransaction(id: string, transaction: Omit<Transaction, '_id'>): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });
    return this.handleResponse(response);
  }

  async deleteTransaction(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
  }
}

export const apiService = new ApiService();
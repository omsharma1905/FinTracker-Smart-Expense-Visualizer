import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Transaction } from '../services/api';
import { TransactionForm } from './TransactionForm';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onAdd: (transaction: Omit<Transaction, '_id'>) => Promise<Transaction>;
  onEdit: (id: string, transaction: Omit<Transaction, '_id'>) => Promise<Transaction>;
  onDelete: (id: string) => Promise<void>;
}

export const TransactionList = ({ 
  transactions, 
  loading, 
  onAdd, 
  onEdit, 
  onDelete 
}: TransactionListProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return '🍕';
      case 'travel': return '✈️';
      case 'billing': return '📄';
      default: return '📦';
    }
  };

  const filterTransactions = (transactions: Transaction[], type?: string) => {
    let filtered = transactions;
    
    if (type && type !== 'all') {
      filtered = filtered.filter(t => t.type === type);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const handleAddTransaction = async (transaction: Omit<Transaction, '_id'>) => {
    await onAdd(transaction);
    setIsFormOpen(false);
  };

  const handleEditTransaction = async (transaction: Omit<Transaction, '_id'>) => {
    if (editingTransaction?._id) {
      await onEdit(editingTransaction._id, transaction);
      setEditingTransaction(null);
    }
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
  };

  const openEditForm = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const closeEditForm = () => {
    setEditingTransaction(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Transactions...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const creditTransactions = filterTransactions(transactions, 'credit');
  const debitTransactions = filterTransactions(transactions, 'debit');
  const allTransactions = filterTransactions(transactions);

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {getCategoryIcon(transaction.category)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{transaction.description}</h3>
                <Badge variant="outline" className="text-xs">
                  {transaction.category}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(transaction.timestamp)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-bold ${
              transaction.type === 'credit' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </span>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditForm(transaction)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this transaction? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => transaction._id && handleDelete(transaction._id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ type }: { type: string }) => (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">💸</div>
      <h3 className="text-lg font-medium mb-2">No {type} transactions found</h3>
      <p className="text-gray-500 mb-4">
        {type === 'all' ? 'Start by adding your first transaction' : `No ${type} transactions match your filters`}
      </p>
      {type === 'all' && (
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      )}
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <CardTitle className="text-xl font-semibold">Transactions</CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="food">🍕 Food</SelectItem>
                  <SelectItem value="travel">✈️ Travel</SelectItem>
                  <SelectItem value="billing">📄 Billing</SelectItem>
                  <SelectItem value="others">📦 Others</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({allTransactions.length})</TabsTrigger>
              <TabsTrigger value="credit" className="text-emerald-600">
                Credits ({creditTransactions.length})
              </TabsTrigger>
              <TabsTrigger value="debit" className="text-red-600">
                Debits ({debitTransactions.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4 mt-6">
              {allTransactions.length === 0 ? (
                <EmptyState type="all" />
              ) : (
                allTransactions.map((transaction) => (
                  <TransactionCard key={transaction._id} transaction={transaction} />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="credit" className="space-y-4 mt-6">
              {creditTransactions.length === 0 ? (
                <EmptyState type="credit" />
              ) : (
                creditTransactions.map((transaction) => (
                  <TransactionCard key={transaction._id} transaction={transaction} />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="debit" className="space-y-4 mt-6">
              {debitTransactions.length === 0 ? (
                <EmptyState type="debit" />
              ) : (
                debitTransactions.map((transaction) => (
                  <TransactionCard key={transaction._id} transaction={transaction} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTransaction}
      />

      <TransactionForm
        isOpen={!!editingTransaction}
        onClose={closeEditForm}
        onSubmit={handleEditTransaction}
        transaction={editingTransaction}
      />
    </>
  );
};

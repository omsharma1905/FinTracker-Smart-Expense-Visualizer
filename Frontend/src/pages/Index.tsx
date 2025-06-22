
import { useState, useEffect } from 'react';
import { Dashboard } from '../components/Dashboard';
import { TransactionList } from '../components/TransactionList';
import { useTransactions } from '../hooks/useTransactions';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const Index = () => {
  const {
    transactions,
    loading,
    error,
    stats,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
  } = useTransactions();

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (error && !isOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <WifiOff className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Connection Lost
              </h2>
              <p className="text-red-600 mb-4">
                Unable to connect to the server. Please check your internet connection and try again.
              </p>
              <Button 
                onClick={refreshTransactions}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            FinTrackr
          </h1>
          <p className="text-gray-600 text-lg">
            Smart Expense Visualizer
          </p>
          <div className="flex items-center justify-center mt-4 space-x-2">
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-emerald-600">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">Offline</span>
              </>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && isOnline && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <div className="flex items-center justify-between">
                <span>{error}</span>
                <Button 
                  onClick={refreshTransactions}
                  variant="outline"
                  size="sm"
                  className="ml-4 border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  Retry
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Dashboard */}
        <Dashboard stats={stats} loading={loading} />

        {/* Transaction List */}
        <TransactionList
          transactions={transactions}
          loading={loading}
          onAdd={addTransaction}
          onEdit={updateTransaction}
          onDelete={deleteTransaction}
        />

        {/* Footer */}
        <div className="text-center py-8 text-gray-500 text-sm">
          <p>Built with React, TypeScript & Tailwind CSS</p>
          <p className="mt-1">Connected to MongoDB via REST API</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

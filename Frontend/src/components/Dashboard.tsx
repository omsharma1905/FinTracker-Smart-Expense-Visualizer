
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { TransactionStats } from '../services/api';

interface DashboardProps {
  stats: TransactionStats;
  loading: boolean;
}

export const Dashboard = ({ stats, loading }: DashboardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-700">
            Total Credits
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-800">
            {formatCurrency(stats.totalCredits)}
          </div>
          <p className="text-xs text-emerald-600 mt-1">
            Money received
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-700">
            Total Debits
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-800">
            {formatCurrency(stats.totalDebits)}
          </div>
          <p className="text-xs text-red-600 mt-1">
            Money spent
          </p>
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-br ${
        stats.netBalance >= 0 
          ? 'from-blue-50 to-blue-100 border-blue-200' 
          : 'from-orange-50 to-orange-100 border-orange-200'
      } hover:shadow-lg transition-all duration-300`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${
            stats.netBalance >= 0 ? 'text-blue-700' : 'text-orange-700'
          }`}>
            Net Balance
          </CardTitle>
          <DollarSign className={`h-4 w-4 ${
            stats.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
          }`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            stats.netBalance >= 0 ? 'text-blue-800' : 'text-orange-800'
          }`}>
            {formatCurrency(stats.netBalance)}
          </div>
          <p className={`text-xs mt-1 ${
            stats.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
          }`}>
            {stats.netBalance >= 0 ? 'Positive balance' : 'Negative balance'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

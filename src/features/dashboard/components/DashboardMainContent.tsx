import React from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatter } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// --- Dummy Data ---
const revenueData = [
    { name: 'Jan', revenue: 4000, visitors: 2400 },
    { name: 'Feb', revenue: 3000, visitors: 1398 },
    { name: 'Mar', revenue: 2000, visitors: 9800 },
    { name: 'Apr', revenue: 2780, visitors: 3908 },
    { name: 'May', revenue: 1890, visitors: 4800 },
    { name: 'Jun', revenue: 2390, visitors: 3800 },
    { name: 'Jul', revenue: 3490, visitors: 4300 },
];

const categoryData = [
    { name: 'Electronics', sales: 4000 },
    { name: 'Clothing', sales: 3000 },
    { name: 'Food', sales: 2000 },
    { name: 'Books', sales: 2780 },
];

const trafficSources = [
    { name: 'Direct', value: 400 },
    { name: 'Social', value: 300 },
    { name: 'Search', value: 300 },
    { name: 'Referral', value: 200 },
];

const recentTransactions = [
    { id: 'TRX-001', customer: 'Alice Smith', amount: 150000, status: 'Completed', date: '2023-10-01' },
    { id: 'TRX-002', customer: 'Bob Johnson', amount: 75000, status: 'Pending', date: '2023-10-02' },
    { id: 'TRX-003', customer: 'Charlie Brown', amount: 320000, status: 'Completed', date: '2023-10-02' },
    { id: 'TRX-004', customer: 'Diana Prince', amount: 45000, status: 'Failed', date: '2023-10-03' },
    { id: 'TRX-005', customer: 'Evan Wright', amount: 89000, status: 'Completed', date: '2023-10-04' },
];

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'];

const DashboardMainContent: React.FC = () => {
    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500">Welcome back! Here is an overview of your system.</p>
            </div>

            {/* --- Summary Cards --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Revenue</CardTitle>
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center text-primary">
                            <DollarSign className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatter(45231.89)}</div>
                        <p className="text-xs text-emerald-500 flex items-center mt-1">
                            <TrendingUp className="w-3 h-3 mr-1" /> +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Users</CardTitle>
                        <div className="w-8 h-8 bg-purple-500/10 rounded flex items-center justify-center text-purple-600">
                            <Users className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-emerald-500 flex items-center mt-1">
                            <TrendingUp className="w-3 h-3 mr-1" /> +180 since last week
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Sessions</CardTitle>
                        <div className="w-8 h-8 bg-emerald-500/10 rounded flex items-center justify-center text-emerald-600">
                            <Activity className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-emerald-500 flex items-center mt-1">
                            <TrendingUp className="w-3 h-3 mr-1" /> +19% from yesterday
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Conversion Rate</CardTitle>
                        <div className="w-8 h-8 bg-amber-500/10 rounded flex items-center justify-center text-amber-600">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3.24%</div>
                        <p className="text-xs text-red-500 flex items-center mt-1">
                            -0.4% from last week
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* --- Main Charts --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <Card className="lg:col-span-2 border-slate-100 shadow-sm">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Monthly revenue vs visitors for the current year</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} tickFormatter={(val) => `$${val}`} />
                                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={10} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                                    <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                    <Line yAxisId="right" type="monotone" dataKey="visitors" name="Visitors" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm">
                    <CardHeader>
                        <CardTitle>Traffic Sources</CardTitle>
                        <CardDescription>Where your users are coming from</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={trafficSources}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {trafficSources.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* --- Secondary Charts & Tables --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                        <CardDescription>Performance across different product categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
                                    <Tooltip 
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="sales" name="Sales" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Latest successful and pending orders</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Transaction</th>
                                        <th className="px-6 py-3 font-medium">Customer</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map((tx, idx) => (
                                        <tr key={tx.id} className={idx !== recentTransactions.length - 1 ? "border-b border-slate-50" : ""}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-slate-900">{tx.id}</div>
                                                <div className="text-xs text-slate-500">{tx.date}</div>
                                            </td>
                                            <td className="px-6 py-4">{tx.customer}</td>
                                            <td className="px-6 py-4">
                                                <Badge 
                                                    variant={tx.status === 'Completed' ? 'default' : tx.status === 'Pending' ? 'secondary' : 'destructive'}
                                                    className="font-normal"
                                                >
                                                    {tx.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium">
                                                {formatter(tx.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardMainContent;

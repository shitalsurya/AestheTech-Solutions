import { useGetAdminStats, getGetAdminStatsQueryKey, useListAdminUsers, getListAdminUsersQueryKey, useListAdminPayments, getListAdminPaymentsQueryKey } from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MindMapAdmin() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStats({
    query: { queryKey: getGetAdminStatsQueryKey() }
  });

  const { data: usersData, isLoading: usersLoading } = useListAdminUsers({ page: 1, limit: 50 }, {
    query: { queryKey: getListAdminUsersQueryKey() }
  });

  const { data: paymentsData, isLoading: paymentsLoading } = useListAdminPayments({
    query: { queryKey: getListAdminPaymentsQueryKey() }
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-bold mb-8">Admin Dashboard</h1>

      {statsLoading ? <div>Loading stats...</div> : stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="glass-card p-6 rounded-2xl border-t-primary">
            <p className="text-sm text-muted-foreground mb-1">Total Users</p>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border-t-accent">
            <p className="text-sm text-muted-foreground mb-1">Premium Users</p>
            <p className="text-3xl font-bold">{stats.premiumUsers}</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border-t-primary">
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-3xl font-bold">₹{stats.totalRevenue}</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border-t-accent">
            <p className="text-sm text-muted-foreground mb-1">Assessments</p>
            <p className="text-3xl font-bold">{stats.assessmentsCompleted}</p>
          </div>
        </div>
      )}

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <div className="glass-card rounded-2xl overflow-hidden">
            {usersLoading ? <div className="p-8 text-center">Loading users...</div> : (
              <Table>
                <TableHeader className="bg-black/20">
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData?.users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={u.avatarUrl || undefined} />
                          <AvatarFallback>{u.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        {u.name}
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell>
                        {u.isPremium ? 
                          <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-500">Premium</span> : 
                          <span className="text-xs px-2 py-1 rounded bg-white/10">Free</span>
                        }
                      </TableCell>
                      <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="glass-card rounded-2xl overflow-hidden">
            {paymentsLoading ? <div className="p-8 text-center">Loading payments...</div> : (
              <Table>
                <TableHeader className="bg-black/20">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(paymentsData as any[])?.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.razorpayOrderId}</TableCell>
                      <TableCell>{p.userId}</TableCell>
                      <TableCell>₹{p.amount / 100}</TableCell>
                      <TableCell>{p.planId}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded ${p.status === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                          {p.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
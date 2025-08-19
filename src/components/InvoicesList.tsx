import { useEffect, useState } from 'react';
import { invoicesService } from '../services/invoicesService';
import type { Invoice } from '../types/domain';
import { Card, CardContent } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';

const statusColor: Record<string,string> = { DRAFT:'bg-gray-100 text-gray-700 border-gray-200', SENT:'bg-blue-100 text-blue-700 border-blue-200', PAID:'bg-green-100 text-green-700 border-green-200', OVERDUE:'bg-red-100 text-red-700 border-red-200', VOID:'bg-gray-200 text-gray-600 border-gray-300' };

export function InvoicesList(){
  const [data,setData] = useState<Invoice[]>([]);
  const [loading,setLoading] = useState(true);
  const [search,setSearch] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(()=>{ let unsub: (()=>void)|undefined; const load=async()=>{ setLoading(true); const res= await invoicesService.list(); setData(res.data); setLoading(false); unsub = invoicesService.onChange(async()=>{ const r= await invoicesService.list(); setData(r.data); });}; load(); return ()=>{ if(unsub) unsub(); }; },[]);

  const filtered = data.filter(inv => {
    const matchesSearch = inv.number.toLowerCase().includes(search.toLowerCase()) || (inv.requestId||'').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status==='all' || inv.status.toLowerCase()===status;
    return matchesSearch && matchesStatus;
  });

  const formatAmount = (amt: number, currency: string) => new Intl.NumberFormat('en-IN',{ style:'currency', currency}).format(amt);

  return <div className="p-6 space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold">Invoices & Quotations</h1>
        <p className="text-muted-foreground mt-1">Track billing documents lifecycle</p>
      </div>
    </div>

    <Card>
      <CardContent className="p-4 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64 relative">
          <Input placeholder="Search by number or request ID" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="void">Void</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-0">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-36">Number</TableHead>
                <TableHead className="w-28">Kind</TableHead>
                <TableHead className="w-40">Request</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="text-right w-40">Amount</TableHead>
                <TableHead className="w-48">Issued</TableHead>
                <TableHead className="text-right w-48">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>}
              {!loading && filtered.map(inv => <TableRow key={inv.id} className={`hover:bg-muted/50 ${inv.status==='OVERDUE' ? 'bg-red-50/60 dark:bg-red-950/30' : ''}`}>
                <TableCell className="font-mono font-medium">{inv.number}</TableCell>
                <TableCell><Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">{inv.kind}</Badge></TableCell>
                <TableCell>{inv.requestId || '-'}</TableCell>
                <TableCell><Badge variant="outline" className={statusColor[inv.status]}> {inv.status}</Badge></TableCell>
                <TableCell className="text-right font-medium">{formatAmount(inv.amount, inv.currency)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{inv.issuedAt.slice(0,10)}</TableCell>
                <TableCell className="text-right space-x-2">
                  {inv.status==='DRAFT' && <Button size="sm" variant="outline" onClick={()=>invoicesService.markSent(inv.id)}>Send</Button>}
                  {inv.status==='SENT' && <Button size="sm" variant="outline" onClick={()=>invoicesService.markPaid(inv.id)}>Mark Paid</Button>}
                </TableCell>
              </TableRow>)}
              {!loading && filtered.length===0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No invoices found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>;
}

import { useEffect, useState } from 'react';
import { auditLogService } from '../services/auditLogService';
import type { AuditLogEntry } from '../types/domain';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface AuditLogPanelProps { entityId: string; className?: string; }

export function AuditLogPanel({ entityId, className }: AuditLogPanelProps){
  const [logs,setLogs] = useState<AuditLogEntry[]>([]);
  useEffect(()=>{ let unsub: (()=>void)|undefined; const load=async()=>{ const res= await auditLogService.list({ entityId }); setLogs(res.data.sort((a,b)=> a.timestamp < b.timestamp ? 1 : -1)); unsub = auditLogService.onChange(async()=>{ const r= await auditLogService.list({ entityId }); setLogs(r.data.sort((a,b)=> a.timestamp < b.timestamp ? 1 : -1)); }); }; load(); return ()=>{ if(unsub) unsub(); }; },[entityId]);
  return <Card className={className}>
    <CardHeader><CardTitle>Audit Log</CardTitle></CardHeader>
    <CardContent className="p-0">
      <div className="max-h-64 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Time</TableHead>
              <TableHead className="w-64">Action</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map(l => <TableRow key={l.id}>
              <TableCell className="text-xs text-muted-foreground">{new Date(l.timestamp).toLocaleString()}</TableCell>
              <TableCell className="font-mono text-xs">{l.action}</TableCell>
              <TableCell className="text-xs">{l.meta ? JSON.stringify(l.meta) : '-'}</TableCell>
            </TableRow>)}
            {logs.length===0 && <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground text-sm">No activity yet</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>;
}

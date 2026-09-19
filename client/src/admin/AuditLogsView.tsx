import React, { useEffect, useState } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import api from '../services/api';

export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/audit-logs?limit=50');
      if (response.data.success) {
        setLogs(response.data.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-amber-400" /> Güvenlik & İşlem Günlükleri (Audit Logs)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Yöneticiler tarafından gerçekleştirilen tüm veri değişiklikleri ve oturum açma kayıtları.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-2 border border-slate-800 text-slate-400 hover:text-white rounded"
          title="Yenile"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Tarih / Saat</th>
              <th className="p-4">Yönetici</th>
              <th className="p-4">İşlem (Action)</th>
              <th className="p-4">Kaynak (Resource)</th>
              <th className="p-4">Detaylar</th>
              <th className="p-4 text-right">IP Adresi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Loglar yükleniyor...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Henüz bir işlem günlüğü bulunmuyor.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-800/40">
                  <td className="p-4 text-slate-400">
                    {new Date(log.createdAt).toLocaleString('tr-TR')}
                  </td>
                  <td className="p-4 text-amber-400 font-bold">{log.adminEmail}</td>
                  <td className="p-4 font-semibold text-white">
                    <span className="px-2 py-0.5 bg-slate-800 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{log.targetResource}</td>
                  <td className="p-4 text-slate-400 max-w-xs truncate">
                    {JSON.stringify(log.details || {})}
                  </td>
                  <td className="p-4 text-right text-slate-500">{log.ipAddress || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

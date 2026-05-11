"use client";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { GetAxiosWithAuth } from "@/lib/axios-instance";
import { formatLongDate } from "@/helper/helper-functions";

interface CancellationRow {
  id: number;
  createdAt: string;
  userEmail: string | null;
  planType: string | null;
  reason: string;
  improvementSuggestion: string;
}

export default function AdminCancellationsPage() {
  const [rows, setRows] = useState<CancellationRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const axios = await GetAxiosWithAuth();
        const res = await axios.get<{ data: CancellationRow[] }>("admin/cancellations");
        if (cancelled) return;
        setRows(res.data.data || []);
      } catch (e) {
        if (cancelled) return;
        const err = e as AxiosError<{ error?: string }>;
        if (err.response?.status === 403) {
          setForbidden(true);
        } else {
          setError(err.response?.data?.error || "Failed to load cancellations");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-muted-foreground">
        You don&apos;t have access to this page
      </div>
    );
  }

  return (
    <div className="p-2">
      <h2 className="text-2xl font-semibold mb-6">Cancellation Feedback</h2>

      {error ? (
        <div className="text-destructive mb-4">{error}</div>
      ) : null}

      {!error && rows && rows.length === 0 ? (
        <div className="text-[#6a6c7b]">No cancellations yet</div>
      ) : null}

      {!error && rows && rows.length > 0 ? (
        <div className="rounded-xl overflow-hidden border">
          <table className="w-full table-fixed">
            <thead className="bg-white border-b border-[#dedede]">
              <tr>
                <th className="text-left py-4 px-6 font-semibold w-40">Date</th>
                <th className="text-left py-4 px-6 font-semibold w-64">User email</th>
                <th className="text-left py-4 px-6 font-semibold w-32">Plan</th>
                <th className="text-left py-4 px-6 font-semibold">Reason</th>
                <th className="text-left py-4 px-6 font-semibold">Improvement suggestion</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-[#dedede] last:border-0 align-top">
                  <td className="py-4 px-6 text-[#6a6c7b]">{formatLongDate(row.createdAt)}</td>
                  <td className="py-4 px-6 text-[#6a6c7b] break-all">{row.userEmail || "—"}</td>
                  <td className="py-4 px-6 text-[#6a6c7b]">{row.planType || "—"}</td>
                  <td className="py-4 px-6 text-[#6a6c7b] whitespace-pre-wrap break-words">{row.reason}</td>
                  <td className="py-4 px-6 text-[#6a6c7b] whitespace-pre-wrap break-words">{row.improvementSuggestion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

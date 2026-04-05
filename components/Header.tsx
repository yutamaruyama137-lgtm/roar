"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-zinc-800/60 sticky top-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <span className="text-2xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent tracking-tight">
            ROAR
          </span>
        </Link>

        {status === "loading" ? (
          <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
        ) : session ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-3 py-2 rounded-xl transition-all"
            >
              {session.user?.image ? (
                <img src={session.user.image} alt="" className="w-6 h-6 rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-xs font-bold text-white">
                  {session.user?.name?.[0] ?? session.user?.email?.[0] ?? "?"}
                </div>
              )}
              <span className="text-sm font-medium text-zinc-200 max-w-[120px] truncate">
                {session.user?.name ?? session.user?.email}
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-20 overflow-hidden">
                  <Link
                    href="/workflows"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    <span>⚡</span> ワークフロー
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors border-t border-zinc-800"
                  >
                    <span>→</span> ログアウト
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm font-semibold text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-lg transition-all"
          >
            ログイン
          </Link>
        )}
      </div>
    </header>
  );
}

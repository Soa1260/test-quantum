'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  UserCheck,
  Search,
  Trash2,
  Lock,
  LogOut,
  ArrowLeft,
  Briefcase,
  TrendingUp,
  Download
} from 'lucide-react';

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [registrations, setRegistrations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loadingData, setLoadingData] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    students: 0,
    professors: 0,
    interested: 0,
  });

  const fetchRegistrations = useCallback(async () => {
    setLoadingData(true);
    try {
      const response = await fetch('/api/admin/registrations');
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.registrations || []);
        calculateStats(data.registrations || []);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  }, []);

  // Check login cookie on load
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const calculateStats = (list: any[]) => {
    const students = list.filter((r) => r.role === 'student').length;
    const professors = list.filter((r) => r.role === 'professor').length;
    const interested = list.filter((r) => r.role === 'interested').length;
    setStats({
      total: list.length,
      students,
      professors,
      interested,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoadingLogin(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setIsAuthenticated(true);
      fetchRegistrations();
    } catch (err: any) {
      setLoginError(err.message || 'Invalid username or password');
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setRegistrations([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this attendee registration?')) return;

    try {
      const response = await fetch('/api/admin/registrations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        const updated = registrations.filter((r) => r.id !== id);
        setRegistrations(updated);
        calculateStats(updated);
      } else {
        alert('Failed to delete registration record.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Filter list based on search term and role filter
  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.institution.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || r.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Export as simple custom download format
  const handleExport = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Institution', 'Role', 'Date Registered'];
    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map((r) =>
        [r.id, `"${r.name}"`, r.email, `"${r.phone || ''}"`, `"${r.institution}"`, r.role, r.createdAt].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `quantum_tech_registrations_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. LOGIN INTERFACE
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-[#0B1533] to-[#5B2C9E] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-[#EDEBF5]">

          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#8B5CF6] uppercase tracking-wider mb-4 hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Main Site
            </Link>

            <div className="relative h-10 w-44 mx-auto mb-4">
              <Image
                src="/assets/iar_logo.png"
                alt="IAR University"
                fill
                className="object-contain"
              />
            </div>

            <h1 className="text-xl font-extrabold text-[#0B1533]">Quantum Event Admin</h1>
            <p className="text-xs text-gray-500 mt-1">Please log in to manage registered participants securely.</p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl mb-6 text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-[#0B1533] mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full bg-[#EDEBF5]/50 border border-[#EDEBF5] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#8B5CF6] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#0B1533] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#EDEBF5]/50 border border-[#EDEBF5] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#8B5CF6] font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loadingLogin}
              className="w-full bg-[#5B2C9E] hover:bg-[#7B3FE4] text-white py-3.5 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {loadingLogin ? 'Verifying Credentials...' : 'Authenticate Securely'}
            </button>
          </form>

          <p className="text-center text-[10px] text-gray-400 mt-6 leading-relaxed">
            Admin portal access only to SHS-HOD!
          </p>

        </div>
      </div>
    );
  }

  // 2. MAIN ADMIN PORTAL DASHBOARD
  return (
    <div className="min-h-screen bg-[#EDEBF5]/30 text-[#1A1A1A] flex flex-col">

      {/* Admin header */}
      <header className="bg-white border-b border-[#EDEBF5] px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-9 w-36">
              <Image
                src="/assets/iar_logo.png"
                alt="IAR University"
                fill
                className="object-contain"
              />
            </div>
            <span className="h-6 w-px bg-gray-300 hidden sm:block"></span>
            <div>
              <h2 className="text-sm font-bold text-[#0B1533] uppercase tracking-wide">
                Registrations Dashboard
              </h2>
              <p className="text-[10px] text-gray-500 font-semibold uppercase">School of Humanities and Sciences</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-bold text-gray-600 hover:text-[#5B2C9E] transition py-2 px-4 rounded-lg bg-gray-100 flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> View Site
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 transition py-2 px-4 rounded-lg flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">

        {/* Quick analytics card deck */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-white p-5 rounded-2xl border border-[#EDEBF5] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0B1533]/5 text-[#0B1533] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Total Attendees</p>
              <p className="text-2xl font-black text-[#0B1533]">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EDEBF5] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#5B2C9E]/5 text-[#5B2C9E] flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Students</p>
              <p className="text-2xl font-black text-[#5B2C9E]">{stats.students}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EDEBF5] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/5 text-[#8B5CF6] flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Professors</p>
              <p className="text-2xl font-black text-[#8B5CF6]">{stats.professors}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EDEBF5] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#4DD8FF]/5 text-[#0B1533] flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Quantum Enthusiasts</p>
              <p className="text-2xl font-black text-gray-700">{stats.interested}</p>
            </div>
          </div>

        </div>

        {/* Database records view */}
        <div className="bg-white rounded-3xl border border-[#EDEBF5] shadow-sm overflow-hidden">

          {/* Controls header */}
          <div className="p-6 border-b border-[#EDEBF5] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Search participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#EDEBF5]/40 border border-[#EDEBF5] text-xs font-semibold rounded-xl py-3 pl-9 pr-4 focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              {/* Role Filter */}
              <div className="w-full sm:w-auto">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full bg-[#EDEBF5]/40 border border-[#EDEBF5] text-xs font-semibold rounded-xl py-3 px-4 focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="professor">Professors</option>
                  <option value="interested">Interested</option>
                </select>
              </div>

            </div>

            {/* Export and action triggers */}
            <div className="w-full md:w-auto flex items-center justify-end gap-2">
              <button
                onClick={handleExport}
                className="bg-[#5B2C9E] hover:bg-[#7B3FE4] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" /> Export CSV ({filteredRegistrations.length})
              </button>
            </div>
          </div>

          {/* Records Table */}
          {loadingData ? (
            <div className="text-center py-16 text-gray-500 font-semibold text-xs">
              Fetching records from database...
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-16 text-gray-400 font-semibold text-xs">
              No registered attendees match the current filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#EDEBF5]/40 text-[#0B1533] uppercase tracking-wider font-extrabold border-b border-[#EDEBF5]">
                    <th className="p-4">Participant Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Institution / University / School</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Date Registered</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDEBF5]">
                  {filteredRegistrations.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 font-bold text-[#0B1533]">{record.name}</td>
                      <td className="p-4 font-medium text-gray-600">{record.email}</td>
                      <td className="p-4 font-semibold text-[#8B5CF6]">{record.phone || 'N/A'}</td>
                      <td className="p-4 font-semibold text-gray-700">{record.institution}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          record.role === 'student'
                            ? 'bg-[#5B2C9E]/10 text-[#5B2C9E]'
                            : record.role === 'professor'
                            ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]'
                            : 'bg-cyan-100 text-[#0B1533]'
                        }`}>
                          {record.role}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-gray-400">
                        {new Date(record.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Registration"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>

      <footer className="bg-white border-t border-[#EDEBF5] py-6 text-center text-xs text-gray-400 mt-12">
        <p>© 2025 IAR University School of Humanities and Sciences. Hardened security portal.</p>
      </footer>

    </div>
  );
}

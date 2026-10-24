import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Search, Plus, CheckCircle, RotateCcw, X } from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const { user } = useAuth();
  const canCatalogBook = !!user?.role && ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'].includes(user.role);

  const [books, setBooks] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'CATALOG' | 'ISSUES'>('CATALOG');
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    accessionNumber: '',
    category: 'Science',
    totalCopies: 5,
    rackLocation: 'Rack 3B',
  });

  const fetchBooks = async (query?: string) => {
    try {
      setLoading(true);
      const q = query !== undefined ? query : search;
      const params: any = {};
      if (q && q.trim()) params.search = q.trim();
      const res = await api.get('/library/books', { params });
      if (res.data.success) {
        setBooks(res.data.books);
      }
    } catch (err) {
      console.error('Failed to load books:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIssues = async () => {
    try {
      const res = await api.get('/library/issues');
      if (res.data.success) {
        setIssues(res.data.issues);
      }
    } catch (err) {
      console.error('Failed to load book issues:', err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/library/books', newBook);
      if (res.data.success) {
        alert('Book added to library catalog!');
        setIsAddBookOpen(false);
        fetchBooks();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add book.');
    }
  };

  const handleReturnBook = async (issueId: string) => {
    try {
      const res = await api.post(`/library/return/${issueId}`, { fineINR: 0 });
      if (res.data.success) {
        alert('Book returned successfully.');
        fetchIssues();
        fetchBooks();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to return book.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Library Catalog & Circulation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {canCatalogBook
              ? 'Book repository, accession numbers, borrowing transactions, and overdue tracking'
              : 'Search available books, access subject references, and view borrowed books'}
          </p>
        </div>
        {canCatalogBook && (
          <button
            onClick={() => setIsAddBookOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Catalog New Book</span>
          </button>
        )}
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('CATALOG')}
            className={`pb-2 text-xs font-bold transition border-b-2 ${
              activeTab === 'CATALOG'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Book Repository ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('ISSUES')}
            className={`pb-2 text-xs font-bold transition border-b-2 ${
              activeTab === 'ISSUES'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Borrowed Books Log ({issues.length})
          </button>
        </div>

        {activeTab === 'CATALOG' && (
          <div className="relative flex items-center w-full sm:w-64 pb-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, author, ISBN..."
              className="w-full pl-8 pr-8 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-inner"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {activeTab === 'CATALOG' ? (
        <div className="bg-white dark:bg-[#0D1522] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b">
                <tr>
                  <th className="py-3 px-4">Accession No.</th>
                  <th className="py-3 px-4">Book Title</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">ISBN</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-center">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {books.map((b) => (
                  <tr key={b._id}>
                    <td className="py-3 px-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                      {b.accessionNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{b.title}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{b.author}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{b.isbn || '—'}</td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {b.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{b.rackLocation || 'Rack 1'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-emerald-600">
                        {b.availableCopies} / {b.totalCopies} Available
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0D1522] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold border-b">
                <tr>
                  <th className="py-3 px-4">Book Title</th>
                  <th className="py-3 px-4">Borrower (Student/Staff)</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {issues.map((iss) => (
                  <tr key={iss._id}>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {iss.bookId?.title}
                    </td>
                    <td className="py-3 px-4 font-semibold text-teal-700 dark:text-teal-400">
                      {iss.studentId?.name || iss.teacherId?.name}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(iss.issueDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(iss.dueDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-50 text-amber-700">
                        {iss.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {iss.status !== 'RETURNED' && (
                        <button
                          onClick={() => handleReturnBook(iss._id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded font-bold text-[11px]"
                        >
                          Mark Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isAddBookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0D1522] rounded-3xl max-w-md w-full shadow-2xl p-6 border space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Catalog Book in Library</h3>
              <button onClick={() => setIsAddBookOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAddBook} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  placeholder="e.g. Higher Algebra by Hall & Knight"
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Author *</label>
                  <input
                    type="text"
                    required
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Accession No. *</label>
                  <input
                    type="text"
                    required
                    value={newBook.accessionNumber}
                    onChange={(e) => setNewBook({ ...newBook, accessionNumber: e.target.value })}
                    placeholder="LIB-MATH-010"
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={newBook.totalCopies}
                    onChange={(e) => setNewBook({ ...newBook, totalCopies: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsAddBookOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-teal-600 text-white font-bold rounded-xl shadow">
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

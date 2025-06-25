import { AuthContext, useAuthProvider, useAuth } from '@/hooks/use-auth';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const auth = useAuthProvider();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    );
  }

  if (!auth.user) {
    return (
      <AuthContext.Provider value={auth}>
        <LoginForm />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </AuthContext.Provider>
  );
}

function LoginForm() {
  const auth = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await auth.login(username, password);
    if (!success) {
      setError('Geçersiz kullanıcı adı veya şifre');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 p-6 sm:p-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">HaberPanel</h1>
          <h2 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-semibold text-gray-900">Giriş Yapın</h2>
        </div>
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Kullanıcı Adı
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-base sm:text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary min-h-[44px]"
              placeholder="admin"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-base sm:text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary min-h-[44px]"
              placeholder="admin123"
            />
          </div>
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base sm:text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 min-h-[44px]"
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}

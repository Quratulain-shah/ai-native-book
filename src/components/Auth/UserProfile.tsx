import React from 'react';
import { authClient } from '../../lib/auth-client';
import { useHistory } from '@docusaurus/router';
import { User, LogOut, Mail, Calendar, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Spotlight } from '../ui/spotlight';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function UserProfile({ session }: { session: any }) {
  const history = useHistory();
  const { siteConfig } = useDocusaurusContext();
  const user = session.user;

  const handleLogout = async () => {
    await authClient.signOut();
    // Clear the fallback token from localStorage
    localStorage.removeItem('auth_token');
    // Force a refresh of the session state after logout
    window.location.href = siteConfig.baseUrl;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full max-w-md mx-auto relative group">
      {/* Background Spotlight effect consistent with landing page */}
      <Spotlight
        className="-top-20 -left-20 md:-left-32 md:-top-20 h-[150%] w-[150%] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        fill="white"
      />
      
      <Card className="bg-white/80 dark:bg-black/40 border border-neutral-200 dark:border-white/10 backdrop-blur-md shadow-2xl overflow-hidden relative z-10 rounded-2xl">
        
        {/* Gradient Banner */}
        <div className="h-32 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-800 dark:to-neutral-900 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
           <div className="absolute top-4 right-4">
            <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium border border-white/20 flex items-center gap-1 shadow-sm">
              <Shield size={12} className="text-[var(--ifm-color-primary)]" />
              <span>Verified User</span>
            </div>
          </div>
        </div>

        <CardHeader className="relative px-8 pt-0 pb-2">
          {/* Avatar - overlapping the banner */}
          <div className="-mt-16 mb-4 flex justify-center">
             <div className="w-32 h-32 rounded-full p-1 bg-white dark:bg-black ring-1 ring-neutral-100 dark:ring-white/10 shadow-xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center relative">
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-neutral-500 to-neutral-800 dark:from-white dark:to-neutral-500">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
             </div>
          </div>

          <div className="text-center space-y-1">
            <CardTitle className="text-3xl font-bold text-neutral-900 dark:text-white font-heading">
              {user.name}
            </CardTitle>
            <CardDescription className="text-neutral-500 dark:text-neutral-400 font-medium flex items-center justify-center gap-1.5">
              <Mail size={14} />
              {user.email}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 py-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="group p-4 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5 hover:border-[var(--ifm-color-primary)]/30 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-white dark:bg-white/10 text-neutral-600 dark:text-neutral-300 shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:text-[var(--ifm-color-primary)]">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider">Joined</p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-0.5">
                    {user.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            <div className="group p-4 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5 hover:border-[var(--ifm-color-primary)]/30 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-white dark:bg-white/10 text-neutral-600 dark:text-neutral-300 shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:text-[var(--ifm-color-primary)]">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider">User ID</p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white font-mono mt-0.5 tracking-tight truncate max-w-[200px]">
                    {user.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-8 pb-8 pt-2">
          <button 
            onClick={handleLogout}
            className="w-full py-3.5 px-4 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 group active:scale-95"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Building2, 
  FileText, 
  Calendar, 
  Receipt, 
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { toast } = useToast();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/proprietaires', icon: Users, label: 'Propriétaires' },
    { path: '/clients', icon: UserCheck, label: 'Clients' },
    { path: '/biens', icon: Building2, label: 'Biens' },
    { path: '/contrats', icon: FileText, label: 'Contrats' },
    { path: '/paiements', icon: Calendar, label: 'Paiements' },
    { path: '/factures', icon: Receipt, label: 'Factures' },
    { path: '/parametres', icon: Settings, label: 'Paramètres' }
  ];

  const handleLogout = () => {
    toast({
      title: "🚧 Fonctionnalité à venir",
      description: "La déconnexion sera bientôt disponible !",
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed lg:sticky top-0 left-0 h-screen w-72 glass-effect z-50 flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 border-b border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                    ImmoGestion+
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">Gestion Locative Pro</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link key={item.path} to={item.path}>
                      <motion.div
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? 'gradient-primary text-white shadow-lg shadow-purple-500/30'
                            : 'text-gray-700 hover:bg-purple-50'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-purple-100">
              <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Administrateur</p>
                  <p className="text-xs text-gray-500">admin@immogestion.com</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="glass-effect sticky top-0 z-40 px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-700">
                  {new Date().toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;

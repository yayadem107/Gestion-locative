
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  UserCheck, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  DollarSign,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    proprietaires: 0,
    biens: 0,
    locataires: 0,
    contratsActifs: 0,
    loyersEncaisses: 0,
    impayes: 0
  });

  useEffect(() => {
    const savedProprietaires = JSON.parse(localStorage.getItem('proprietaires') || '[]');
    const savedBiens = JSON.parse(localStorage.getItem('biens') || '[]');
    const savedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    const savedContrats = JSON.parse(localStorage.getItem('contrats') || '[]');
    const savedPaiements = JSON.parse(localStorage.getItem('paiements') || '[]');

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const paiementsThisMonth = savedPaiements.filter(p => {
      const pDate = new Date(p.date);
      return pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear && p.statut === 'payé';
    });

    const loyersEncaisses = paiementsThisMonth.reduce((sum, p) => sum + (p.montant || 0), 0);

    const impayes = savedPaiements.filter(p => p.statut === 'impayé').reduce((sum, p) => sum + (p.montant || 0), 0);

    setStats({
      proprietaires: savedProprietaires.length,
      biens: savedBiens.length,
      locataires: savedClients.length,
      contratsActifs: savedContrats.filter(c => c.statut === 'actif').length,
      loyersEncaisses,
      impayes
    });
  }, []);

  const monthlyData = [
    { mois: 'Jan', paiements: 45000 },
    { mois: 'Fév', paiements: 52000 },
    { mois: 'Mar', paiements: 48000 },
    { mois: 'Avr', paiements: 61000 },
    { mois: 'Mai', paiements: 55000 },
    { mois: 'Juin', paiements: 67000 },
  ];

  const statCards = [
    {
      title: 'Propriétaires',
      value: stats.proprietaires,
      icon: Users,
      gradient: 'from-purple-500 to-indigo-600',
      bgGradient: 'from-purple-50 to-indigo-50'
    },
    {
      title: 'Biens Immobiliers',
      value: stats.biens,
      icon: Building2,
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Locataires Actifs',
      value: stats.locataires,
      icon: UserCheck,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50'
    },
    {
      title: 'Contrats en Cours',
      value: stats.contratsActifs,
      icon: FileText,
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50'
    },
    {
      title: 'Loyers Encaissés (Mois)',
      value: `${stats.loyersEncaisses.toLocaleString('fr-FR')} FCFA`,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Impayés',
      value: `${stats.impayes.toLocaleString('fr-FR')} FCFA`,
      icon: AlertCircle,
      gradient: 'from-red-500 to-rose-600',
      bgGradient: 'from-red-50 to-rose-50'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Tableau de bord - ImmoGestion+</title>
        <meta name="description" content="Vue d'ensemble de votre gestion locative immobilière" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">Vue d'ensemble de votre gestion locative</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-effect rounded-2xl p-6 bg-gradient-to-br ${card.bgGradient}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Paiements Mensuels</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mois" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar dataKey="paiements" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Évolution des Revenus</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mois" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="paiements" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

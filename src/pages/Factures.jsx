import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  Receipt, 
  Download, 
  Mail, 
  MessageSquare, 
  Printer, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Building, 
  User
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Factures = () => {
  const { toast } = useToast();
  const [factures, setFactures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  // Données de démonstration
  const demoFactures = [
    {
      id: '1',
      numero: 'FAC-00001',
      client: 'Martin Dupont',
      bien: 'Appartement Riviera',
      mois: '2024-01',
      montant: 250000,
      dateCreation: '2024-01-05',
      statut: 'générée'
    },
    {
      id: '2', 
      numero: 'FAC-00002',
      client: 'Sophie Bernard',
      bien: 'Studio Plateau',
      mois: '2024-01',
      montant: 180000,
      dateCreation: '2024-01-10',
      statut: 'générée'
    }
  ];

  useEffect(() => {
    // Charger les factures depuis localStorage ou utiliser les données de démo
    const savedFactures = localStorage.getItem('factures');
    if (savedFactures) {
      setFactures(JSON.parse(savedFactures));
    } else {
      setFactures(demoFactures);
      localStorage.setItem('factures', JSON.stringify(demoFactures));
    }
  }, []);

  const saveFactures = (newFactures) => {
    setFactures(newFactures);
    localStorage.setItem('factures', JSON.stringify(newFactures));
  };

  const genererFacture = () => {
    const newFacture = {
      id: Date.now().toString(),
      numero: `FAC-${String(factures.length + 1).padStart(5, '0')}`,
      client: 'Nouveau Client',
      bien: 'Nouveau Bien',
      mois: new Date().toISOString().slice(0, 7),
      montant: 200000,
      dateCreation: new Date().toISOString().split('T')[0],
      statut: 'générée'
    };

    const updatedFactures = [newFacture, ...factures];
    saveFactures(updatedFactures);
    
    toast({
      title: "✅ Facture générée",
      description: `La facture ${newFacture.numero} a été créée.`,
    });
  };

  const envoyerWhatsApp = (facture) => {
    const message = `Bonjour, voici votre facture de loyer ${facture.numero}. Montant: ${facture.montant.toLocaleString()} FCFA.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    
    toast({
      title: "📱 Envoi WhatsApp",
      description: "Ouverture de WhatsApp.",
    });
  };

  const envoyerGmail = (facture) => {
    const subject = `Facture ${facture.numero}`;
    const body = `Bonjour,\n\nFacture ${facture.numero}\nMontant: ${facture.montant.toLocaleString()} FCFA\n\nCordialement.`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    
    toast({
      title: "📧 Envoi Gmail",
      description: "Ouverture de Gmail.",
    });
  };

  const telechargerFacture = (facture) => {
    toast({
      title: "📄 Téléchargement",
      description: `Facture ${facture.numero} téléchargée.`,
    });
  };

  const imprimerFacture = (facture) => {
    window.print();
    toast({
      title: "🖨️ Impression",
      description: `Impression de ${facture.numero}.`,
    });
  };

  const exporterExcel = () => {
    toast({
      title: "📊 Export Excel",
      description: `${factures.length} factures exportées.`,
    });
  };

  const filteredFactures = factures.filter(facture => {
    return (
      facture.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.bien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.numero.toLowerCase().includes(searchTerm.toLowerCase())
    ) && (selectedMonth === '' || facture.mois === selectedMonth);
  });

  const moisUniques = [...new Set(factures.map(f => f.mois))].sort().reverse();

  return (
    <>
      <Helmet>
        <title>Factures - ImmoGestion+</title>
        <meta name="description" content="Gestion des factures de loyer" />
      </Helmet>

      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
              Factures
            </h1>
            <p className="text-gray-600">Gérez vos factures de loyer</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={genererFacture}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Générer une facture
            </button>
            <button 
              onClick={exporterExcel}
              className="px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Exporter
            </button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une facture..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les mois</option>
            {moisUniques.map(mois => (
              <option key={mois} value={mois}>
                {new Date(mois + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedMonth(''); }}
            className="px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Réinitialiser
          </button>
        </motion.div>

        {/* Liste des factures */}
        {filteredFactures.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bien</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mois</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredFactures.map((facture, index) => (
                    <tr key={facture.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-blue-600">{facture.numero}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>{facture.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{facture.bien}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(facture.mois + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600">
                        {facture.montant.toLocaleString()} FCFA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(facture.dateCreation).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                          ✓ {facture.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => telechargerFacture(facture)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Télécharger"
                          >
                            <Download className="h-4 w-4 text-blue-600" />
                          </button>
                          <button 
                            onClick={() => imprimerFacture(facture)}
                            className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                            title="Imprimer"
                          >
                            <Printer className="h-4 w-4 text-purple-600" />
                          </button>
                          <button 
                            onClick={() => envoyerWhatsApp(facture)}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                            title="Envoyer WhatsApp"
                          >
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          </button>
                          <button 
                            onClick={() => envoyerGmail(facture)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Envoyer Email"
                          >
                            <Mail className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-200"
          >
            <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune facture trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              {factures.length === 0 
                ? "Commencez par générer votre première facture." 
                : "Aucune facture ne correspond à votre recherche."}
            </p>
            <button 
              onClick={genererFacture}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              Générer une facture
            </button>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Factures;
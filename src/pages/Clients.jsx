
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, UserCheck, Download, FileText, FileUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nomComplet: '',
    typePiece: '',
    numeroPiece: '',
    telephone: '',
    email: '',
    adresse: '',
    documentIdentite: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem('clients');
    if (saved) {
      setClients(JSON.parse(saved));
    }
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem('clients', JSON.stringify(data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const updated = clients.map(c => c.id === editingId ? { ...formData, id: editingId } : c);
      setClients(updated);
      saveToLocalStorage(updated);
      toast({ title: "✅ Client modifié", description: "Les informations ont été mises à jour." });
    } else {
      const newClient = { ...formData, id: Date.now().toString() };
      const updated = [...clients, newClient];
      setClients(updated);
      saveToLocalStorage(updated);
      toast({ title: "✅ Client ajouté", description: "Le nouveau client a été créé." });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (client) => {
    setFormData(client);
    setEditingId(client.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    saveToLocalStorage(updated);
    toast({ title: "🗑️ Client supprimé", description: "Le client a été supprimé." });
  };
  
  const handleNotImplemented = () => {
    toast({
      title: "🚧 Fonctionnalité à venir",
      description: "Cette fonctionnalité sera bientôt disponible !",
    });
  };

  const resetForm = () => {
    setFormData({
      nomComplet: '', typePiece: '', numeroPiece: '', telephone: '',
      email: '', adresse: '', documentIdentite: null,
    });
    setEditingId(null);
  };
  
  const handleExportCSV = () => {
     if (clients.length === 0) {
        toast({ title: "Données vides", description: "Aucun client à exporter.", variant: "destructive" });
        return;
    }
    const headers = ["ID", "Nom Complet", "Téléphone", "Email", "Adresse", "Type Pièce", "Numéro Pièce"];
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + clients.map(c => [c.id, c.nomComplet, c.telephone, c.email, c.adresse, c.typePiece, c.numeroPiece].join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "clients.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "✅ Exportation réussie", description: "Le fichier CSV des clients a été téléchargé." });
  };


  const filteredClients = clients.filter(c =>
    c.nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telephone.includes(searchTerm) ||
    c.numeroPiece.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Clients - ImmoGestion+</title>
        <meta name="description" content="Gestion des clients (locataires)" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
              Clients (locataires)
            </h1>
            <p className="text-gray-600">Gérez vos locataires et leurs informations.</p>
          </div>
          <div className="flex gap-2">
             <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary text-white shadow-lg shadow-purple-500/30">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un client
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingId ? 'Modifier le client' : 'Nouveau client'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <Label htmlFor="nomComplet">Nom complet *</Label>
                            <Input id="nomComplet" value={formData.nomComplet} onChange={(e) => setFormData({...formData, nomComplet: e.target.value})} required/>
                        </div>
                        <div>
                            <Label htmlFor="typePiece">Type de pièce d'identité *</Label>
                             <Select value={formData.typePiece} onValueChange={(v) => setFormData({...formData, typePiece: v})}>
                                <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cni">CNI</SelectItem>
                                    <SelectItem value="passeport">Passeport</SelectItem>
                                    <SelectItem value="autre">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="numeroPiece">Numéro de la pièce *</Label>
                            <Input id="numeroPiece" value={formData.numeroPiece} onChange={(e) => setFormData({...formData, numeroPiece: e.target.value})} required/>
                        </div>
                        <div>
                            <Label htmlFor="telephone">Téléphone / WhatsApp *</Label>
                            <Input id="telephone" type="tel" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} required/>
                        </div>
                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required/>
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="adresse">Adresse complète *</Label>
                            <Input id="adresse" value={formData.adresse} onChange={(e) => setFormData({...formData, adresse: e.target.value})} required/>
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="documentIdentite">Document d'identité (PDF, Image)</Label>
                            <Input id="documentIdentite" type="file" accept="image/*,application/pdf" onChange={(e) => toast({title: "📎 Fichier prêt", description: e.target.files[0].name})}/>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                      <Button type="submit" className="gradient-primary text-white">{editingId ? 'Modifier' : 'Ajouter'}</Button>
                    </div>
                  </form>
                </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input placeholder="Rechercher par nom, téléphone, N° pièce..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
            </div>
        </div>

        <div className="overflow-x-auto glass-effect rounded-2xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Complet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pièce d'identité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.length > 0 ? filteredClients.map(client => (
                <motion.tr key={client.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{client.nomComplet}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.telephone}</div>
                    <div className="text-sm text-gray-500">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.typePiece.toUpperCase()}</div>
                    <div className="text-sm text-gray-500">{client.numeroPiece}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleNotImplemented()}><Eye className="h-4 w-4 text-blue-600" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(client)}><Edit className="h-4 w-4 text-purple-600" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(client.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                 <tr>
                    <td colSpan="4" className="text-center py-12">
                      <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700">Aucun client trouvé</h3>
                      <p className="text-gray-500">Commencez par ajouter votre premier locataire.</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Clients;

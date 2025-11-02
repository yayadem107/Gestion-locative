
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Building2, Search, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const Biens = () => {
  const [biens, setBiens] = useState([]);
  const [proprietaires, setProprietaires] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nom: '', type: '', porte: '', etage: '', prix: '', caution: '', proprietaireId: '', image: null, document: null
  });

  const [filter, setFilter] = useState({ proprietaire: 'all', statut: 'all' });

  useEffect(() => {
    const savedBiens = localStorage.getItem('biens');
    if (savedBiens) setBiens(JSON.parse(savedBiens));
    const savedProprietaires = localStorage.getItem('proprietaires');
    if (savedProprietaires) setProprietaires(JSON.parse(savedProprietaires));
  }, []);

  const saveToLocalStorage = (data) => localStorage.setItem('biens', JSON.stringify(data));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const updated = biens.map(b => b.id === editingId ? { ...formData, id: editingId } : b);
      setBiens(updated);
      saveToLocalStorage(updated);
      toast({ title: "✅ Bien modifié" });
    } else {
      const newBien = { ...formData, id: Date.now().toString(), statut: 'disponible' };
      const updated = [...biens, newBien];
      setBiens(updated);
      saveToLocalStorage(updated);
      toast({ title: "✅ Bien ajouté" });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (bien) => {
    setFormData(bien);
    setEditingId(bien.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    const updated = biens.filter(b => b.id !== id);
    setBiens(updated);
    saveToLocalStorage(updated);
    toast({ title: "🗑️ Bien supprimé" });
  };
  
  const handleNotImplemented = () => toast({ title: "🚧 Fonctionnalité à venir" });

  const resetForm = () => {
    setFormData({ nom: '', type: '', porte: '', etage: '', prix: '', caution: '', proprietaireId: '', image: null, document: null });
    setEditingId(null);
  };
  
  const getProprietaireName = (id) => {
      const p = proprietaires.find(p => p.id === id);
      return p ? `${p.prenom} ${p.nom}` : 'N/A';
  }

  const filteredBiens = biens.filter(bien => {
    const proprietaireMatch = filter.proprietaire === 'all' || bien.proprietaireId === filter.proprietaire;
    const statutMatch = filter.statut === 'all' || bien.statut === filter.statut;
    return proprietaireMatch && statutMatch;
  });

  return (
    <>
      <Helmet><title>Biens Immobiliers - ImmoGestion+</title></Helmet>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">Biens Immobiliers</h1>
            <p className="text-gray-600">Gérez vos biens en location.</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white shadow-lg shadow-purple-500/30">
                  <Plus className="h-4 w-4 mr-2" /> Ajouter un bien
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{editingId ? 'Modifier le bien' : 'Nouveau bien'}</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <Label htmlFor="nom">Nom du bien *</Label>
                            <Input id="nom" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} required/>
                        </div>
                        <div>
                            <Label htmlFor="type">Type de bien *</Label>
                             <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                                <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="studio">Studio</SelectItem>
                                    <SelectItem value="appartement">Appartement</SelectItem>
                                    <SelectItem value="maison">Maison</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="proprietaireId">Propriétaire *</Label>
                             <Select value={formData.proprietaireId} onValueChange={(v) => setFormData({...formData, proprietaireId: v})}>
                                <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                                <SelectContent>
                                    {proprietaires.map(p => <SelectItem key={p.id} value={p.id}>{p.prenom} {p.nom}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="porte">Numéro de porte</Label>
                            <Input id="porte" value={formData.porte} onChange={(e) => setFormData({...formData, porte: e.target.value})}/>
                        </div>
                        <div>
                            <Label htmlFor="etage">Étage</Label>
                            <Input id="etage" value={formData.etage} onChange={(e) => setFormData({...formData, etage: e.target.value})}/>
                        </div>
                        <div>
                            <Label htmlFor="prix">Prix mensuel (FCFA) *</Label>
                            <Input id="prix" type="number" value={formData.prix} onChange={(e) => setFormData({...formData, prix: e.target.value})} required/>
                        </div>
                        <div>
                            <Label htmlFor="caution">Montant caution (FCFA) *</Label>
                            <Input id="caution" type="number" value={formData.caution} onChange={(e) => setFormData({...formData, caution: e.target.value})} required/>
                        </div>
                         <div className="md:col-span-2">
                            <Label htmlFor="image">Image du bien</Label>
                            <Input id="image" type="file" accept="image/*" onChange={(e) => toast({title: "🖼️ Image prête", description: e.target.files[0].name})}/>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                      <Button type="submit" className="gradient-primary text-white">{editingId ? 'Modifier' : 'Ajouter'}</Button>
                    </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleNotImplemented}>
              <Download className="h-4 w-4 mr-2" />
              Exporter PDF
            </Button>
          </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
            <Select value={filter.proprietaire} onValueChange={(v) => setFilter({...filter, proprietaire: v})}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Filtrer par propriétaire..." /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les propriétaires</SelectItem>
                    {proprietaires.map(p => <SelectItem key={p.id} value={p.id}>{p.prenom} {p.nom}</SelectItem>)}
                </SelectContent>
            </Select>
             <Select value={filter.statut} onValueChange={(v) => setFilter({...filter, statut: v})}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Filtrer par statut..." /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="disponible">🟢 Disponible</SelectItem>
                    <SelectItem value="loué">🔴 Loué</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBiens.length > 0 ? filteredBiens.map((bien, index) => (
            <motion.div
              key={bien.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl overflow-hidden hover:shadow-2xl transition-all group"
            >
              <div className="relative h-48 bg-gray-200">
                <img class="w-full h-full object-cover" alt={bien.nom} src="" />
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white ${bien.statut === 'disponible' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    {bien.statut === 'disponible' ? 'Disponible' : 'Loué'}
                </div>
              </div>
              <div className="p-4">
                 <h3 className="font-bold text-lg text-gray-900">{bien.nom}</h3>
                 <p className="text-sm text-gray-500">{getProprietaireName(bien.proprietaireId)}</p>
                 <p className="text-2xl font-bold gradient-primary bg-clip-text text-transparent my-2">{Number(bien.prix).toLocaleString('fr-FR')} FCFA/mois</p>
                 <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(bien)}><Edit className="h-4 w-4 mr-1" /> Modifier</Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(bien.id)}><Trash2 className="h-4 w-4" /></Button>
                 </div>
              </div>
            </motion.div>
          )) : (
            <div className="lg:col-span-3 text-center py-12 glass-effect rounded-2xl">
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">Aucun bien trouvé</h3>
              <p className="text-gray-500">Commencez par ajouter votre premier bien immobilier.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Biens;


import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Building2, Users as UsersIcon, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const Proprietaires = () => {
  const [proprietaires, setProprietaires] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    typePiece: '',
    pieceIdentite: null
  });

  useEffect(() => {
    const saved = localStorage.getItem('proprietaires');
    if (saved) {
      setProprietaires(JSON.parse(saved));
    }
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem('proprietaires', JSON.stringify(data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      const updated = proprietaires.map(p => 
        p.id === editingId ? { ...formData, id: editingId } : p
      );
      setProprietaires(updated);
      saveToLocalStorage(updated);
      toast({
        title: "✅ Propriétaire modifié",
        description: "Les informations ont été mises à jour avec succès.",
      });
    } else {
      const newProprietaire = {
        ...formData,
        id: Date.now().toString(),
        dateCreation: new Date().toISOString()
      };
      const updated = [...proprietaires, newProprietaire];
      setProprietaires(updated);
      saveToLocalStorage(updated);
      toast({
        title: "✅ Propriétaire ajouté",
        description: "Le nouveau propriétaire a été créé avec succès.",
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (proprietaire) => {
    setFormData(proprietaire);
    setEditingId(proprietaire.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    const updated = proprietaires.filter(p => p.id !== id);
    setProprietaires(updated);
    saveToLocalStorage(updated);
    toast({
      title: "🗑️ Propriétaire supprimé",
      description: "Le propriétaire a été supprimé de la base de données.",
    });
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
      adresse: '',
      typePiece: '',
      pieceIdentite: null
    });
    setEditingId(null);
  };

  const getBiensCount = (proprietaireId) => {
    const biens = JSON.parse(localStorage.getItem('biens') || '[]');
    return biens.filter(b => b.proprietaireId === proprietaireId).length;
  };

  const filteredProprietaires = proprietaires.filter(p =>
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Propriétaires - ImmoGestion+</title>
        <meta name="description" content="Gestion des propriétaires immobiliers" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
              Propriétaires
            </h1>
            <p className="text-gray-600">Gérez vos propriétaires immobiliers</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un propriétaire
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Modifier le propriétaire' : 'Nouveau propriétaire'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input
                      id="prenom"
                      value={formData.prenom}
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telephone">Téléphone *</Label>
                    <Input
                      id="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="adresse">Adresse *</Label>
                    <Input
                      id="adresse"
                      value={formData.adresse}
                      onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="typePiece">Type de pièce d'identité *</Label>
                    <Select
                      value={formData.typePiece}
                      onValueChange={(value) => setFormData({...formData, typePiece: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cni">CNI</SelectItem>
                        <SelectItem value="passeport">Passeport</SelectItem>
                        <SelectItem value="permis">Permis de conduire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pieceIdentite">Pièce d'identité</Label>
                    <Input
                      id="pieceIdentite"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          toast({
                            title: "📎 Fichier sélectionné",
                            description: file.name,
                          });
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="gradient-primary text-white">
                    {editingId ? 'Modifier' : 'Ajouter'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="glass-effect rounded-2xl p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Rechercher un propriétaire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Proprietaires Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProprietaires.map((proprietaire, index) => (
            <motion.div
              key={proprietaire.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-6 hover:shadow-2xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg">
                    {proprietaire.prenom[0]}{proprietaire.nom[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {proprietaire.prenom} {proprietaire.nom}
                    </h3>
                    <p className="text-sm text-gray-500">{proprietaire.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Tél:</span> {proprietaire.telephone}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Adresse:</span> {proprietaire.adresse}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2 text-purple-600">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm font-medium">{getBiensCount(proprietaire.id)} biens</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(proprietaire)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(proprietaire.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProprietaires.length === 0 && (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <UsersIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun propriétaire</h3>
            <p className="text-gray-600">Commencez par ajouter votre premier propriétaire</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Proprietaires;

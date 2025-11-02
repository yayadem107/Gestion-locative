
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, FileText, Download, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

const Contrats = () => {
    const [contrats, setContrats] = useState([]);
    const [biens, setBiens] = useState([]);
    const [clients, setClients] = useState([]);
    const [proprietaires, setProprietaires] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        proprietaireId: '', clientId: '', bienId: '', loyer: '', caution: '', regles: '', dateDebut: '', dateFin: ''
    });

    useEffect(() => {
        const loadData = (key, setter) => {
            const saved = localStorage.getItem(key);
            if (saved) setter(JSON.parse(saved));
        };
        loadData('contrats', setContrats);
        loadData('biens', setBiens);
        loadData('clients', setClients);
        loadData('proprietaires', setProprietaires);
    }, []);

    const saveToLocalStorage = (data) => localStorage.setItem('contrats', JSON.stringify(data));

    const handleSubmit = (e) => {
        e.preventDefault();
        const bien = biens.find(b => b.id === formData.bienId);
        
        if (editingId) {
            const updated = contrats.map(c => c.id === editingId ? { ...formData, id: editingId } : c);
            setContrats(updated);
            saveToLocalStorage(updated);
            toast({ title: "✅ Contrat modifié" });
        } else {
            const newContrat = { ...formData, id: Date.now().toString(), statut: 'actif' };
            const updated = [...contrats, newContrat];
            setContrats(updated);
            saveToLocalStorage(updated);
            
            // Update bien status
            const updatedBiens = biens.map(b => b.id === bien.id ? {...b, statut: 'loué'} : b);
            setBiens(updatedBiens);
            localStorage.setItem('biens', JSON.stringify(updatedBiens));
            
            toast({ title: "✅ Contrat créé" });
        }
        setIsDialogOpen(false);
        resetForm();
    };
    
    const handleBienChange = (bienId) => {
        const bien = biens.find(b => b.id === bienId);
        if(bien) {
            setFormData({...formData, bienId, loyer: bien.prix, caution: bien.caution, proprietaireId: bien.proprietaireId });
        }
    };

    const handleEdit = (contrat) => {
        setFormData(contrat);
        setEditingId(contrat.id);
        setIsDialogOpen(true);
    };

    const handleDelete = (id) => {
        const contrat = contrats.find(c => c.id === id);
        const updated = contrats.filter(c => c.id !== id);
        setContrats(updated);
        saveToLocalStorage(updated);

        // Make bien available again
        const updatedBiens = biens.map(b => b.id === contrat.bienId ? {...b, statut: 'disponible'} : b);
        setBiens(updatedBiens);
        localStorage.setItem('biens', JSON.stringify(updatedBiens));
        
        toast({ title: "🗑️ Contrat supprimé" });
    };

    const handleNotImplemented = () => toast({ title: "🚧 Fonctionnalité à venir" });
    const resetForm = () => setFormData({ proprietaireId: '', clientId: '', bienId: '', loyer: '', caution: '', regles: '', dateDebut: '', dateFin: '' });
    
    const getName = (id, type) => {
        const data = {proprietaires, clients, biens}[type];
        const item = data?.find(i => i.id === id);
        return item?.nom || item?.nomComplet || 'N/A';
    };

    return (
    <>
      <Helmet><title>Contrats - ImmoGestion+</title></Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">Contrats de Location</h1>
            <p className="text-gray-600">Générez et gérez les contrats.</p>
          </div>
           <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white shadow-lg"><Plus className="h-4 w-4 mr-2" /> Nouveau contrat</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{editingId ? 'Modifier le contrat' : 'Nouveau contrat'}</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="md:col-span-2">
                         <Label>Bien concerné *</Label>
                         <Select onValueChange={handleBienChange} value={formData.bienId}>
                             <SelectTrigger><SelectValue placeholder="Sélectionner un bien disponible..."/></SelectTrigger>
                             <SelectContent>
                                {biens.filter(b => b.statut === 'disponible' || (editingId && b.id === formData.bienId)).map(b => <SelectItem key={b.id} value={b.id}>{b.nom}</SelectItem>)}
                             </SelectContent>
                         </Select>
                     </div>
                     <div>
                        <Label>Locataire (Client) *</Label>
                        <Select onValueChange={(v) => setFormData({...formData, clientId: v})} value={formData.clientId}>
                           <SelectTrigger><SelectValue placeholder="Sélectionner un client..."/></SelectTrigger>
                           <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.nomComplet}</SelectItem>)}</SelectContent>
                        </Select>
                     </div>
                      <div>
                        <Label>Propriétaire</Label>
                        <Input value={getName(formData.proprietaireId, 'proprietaires')} disabled />
                     </div>
                     <div>
                        <Label>Montant du Loyer (FCFA)</Label>
                        <Input type="number" value={formData.loyer} onChange={(e) => setFormData({...formData, loyer: e.target.value})} />
                     </div>
                      <div>
                        <Label>Montant de la Caution (FCFA)</Label>
                        <Input type="number" value={formData.caution} onChange={(e) => setFormData({...formData, caution: e.target.value})} />
                     </div>
                     <div>
                        <Label>Date de début *</Label>
                        <Input type="date" value={formData.dateDebut} onChange={(e) => setFormData({...formData, dateDebut: e.target.value})} required/>
                     </div>
                      <div>
                        <Label>Date de fin (facultatif)</Label>
                        <Input type="date" value={formData.dateFin} onChange={(e) => setFormData({...formData, dateFin: e.target.value})} />
                     </div>
                     <div className="md:col-span-2">
                        <Label>Règles et clauses du contrat</Label>
                        <Textarea value={formData.regles} onChange={(e) => setFormData({...formData, regles: e.target.value})} />
                     </div>
                  </div>
                   <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                      <Button type="submit" className="gradient-primary text-white">{editingId ? 'Modifier' : 'Créer le contrat'}</Button>
                    </div>
                </form>
              </DialogContent>
           </Dialog>
        </div>
        <div className="overflow-x-auto glass-effect rounded-2xl">
          <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bien / Locataire</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contrats.length > 0 ? contrats.map(contrat => (
                <tr key={contrat.id}>
                  <td className="px-6 py-4">
                     <div className="font-medium text-gray-900">{getName(contrat.bienId, 'biens')}</div>
                     <div className="text-sm text-gray-500">{getName(contrat.clientId, 'clients')}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                     Début: {new Date(contrat.dateDebut).toLocaleDateString()}<br/>
                     Fin: {contrat.dateFin ? new Date(contrat.dateFin).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${contrat.statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                         {contrat.statut}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={handleNotImplemented}><Download className="h-4 w-4 text-blue-600" /></Button>
                      <Button variant="ghost" size="icon" onClick={handleNotImplemented}><Send className="h-4 w-4 text-green-600" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(contrat)}><Edit className="h-4 w-4 text-purple-600" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(contrat.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </td>
                </tr>
              )) : (
                 <tr>
                    <td colSpan="4" className="text-center py-12">
                      <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold">Aucun contrat</h3>
                      <p className="text-gray-500">Créez votre premier contrat de location.</p>
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

export default Contrats;

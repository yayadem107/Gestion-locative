
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const Paiements = () => {
    const [currentDate, setCurrentDate] = useState(new Date('2025-10-26'));
    const [paiements, setPaiements] = useState([]);
    const [contrats, setContrats] = useState([]);
    const [clients, setClients] = useState([]);
    const [biens, setBiens] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPaiement, setEditingPaiement] = useState(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        contratId: '',
        date: new Date().toISOString().split('T')[0],
        montant: '',
        statut: 'payé',
        methode: 'espèces',
    });
    
    useEffect(() => {
        const loadData = (key, setter) => {
            const saved = localStorage.getItem(key);
            if (saved) setter(JSON.parse(saved));
        };
        loadData('paiements', setPaiements);
        loadData('contrats', setContrats);
        loadData('clients', setClients);
        loadData('biens', setBiens);
    }, []);

    const generatedPaiements = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const today = new Date('2025-10-26');

        let allPaiements = [...paiements];

        contrats.forEach(contrat => {
            if (contrat.statut !== 'actif') return;
            
            const moisConcerne = `${year}-${String(month + 1).padStart(2, '0')}`;
            const existingPaiement = allPaiements.find(p => p.contratId === contrat.id && p.moisConcerne === moisConcerne);

            if (!existingPaiement) {
                const dueDate = new Date(contrat.dateDebut);
                dueDate.setMonth(month);
                dueDate.setFullYear(year);

                let statut = 'en attente';
                if(today > dueDate) {
                    statut = 'impayé';
                }

                allPaiements.push({
                    id: `gen-${contrat.id}-${moisConcerne}`,
                    contratId: contrat.id,
                    montant: contrat.loyer,
                    date: dueDate.toISOString().split('T')[0],
                    moisConcerne,
                    statut,
                    isGenerated: true
                });
            }
        });
        return allPaiements;
    }, [currentDate, paiements, contrats]);


    const savePaiements = (data) => {
        const nonGenerated = data.filter(p => !p.isGenerated);
        localStorage.setItem('paiements', JSON.stringify(nonGenerated));
        setPaiements(nonGenerated);
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1) });
    
    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    
    const resetForm = () => {
        setFormData({ contratId: '', date: new Date().toISOString().split('T')[0], montant: '', statut: 'payé', methode: 'espèces' });
        setEditingPaiement(null);
    }
    
    const handleContratChange = (contratId) => {
        const contrat = contrats.find(c => c.id === contratId);
        if(contrat) setFormData({...formData, contratId, montant: contrat.loyer});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const moisConcerne = new Date(formData.date).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit' });
        
        if (editingPaiement) {
            const updated = generatedPaiements.map(p => p.id === editingPaiement.id ? { ...formData, id: p.id, moisConcerne, isGenerated: false } : p);
            savePaiements(updated);
            toast({ title: "✅ Paiement modifié" });
        } else {
             const newPaiement = { ...formData, id: Date.now().toString(), moisConcerne, isGenerated: false };
             // remove generated paiement for same contract/month if it exists
             const filtered = generatedPaiements.filter(p => !(p.contratId === newPaiement.contratId && p.moisConcerne === newPaiement.moisConcerne));
             savePaiements([...filtered, newPaiement]);
             toast({ title: "✅ Paiement ajouté" });
        }
        setIsDialogOpen(false);
        resetForm();
    };

    const handleEdit = (paiement) => {
        setEditingPaiement(paiement);
        setFormData({
            contratId: paiement.contratId,
            date: paiement.date,
            montant: paiement.montant,
            statut: paiement.statut,
            methode: paiement.methode || 'espèces',
        });
        setIsDialogOpen(true);
    };
    
    const handleDelete = (id) => {
        const updated = generatedPaiements.filter(p => p.id !== id);
        savePaiements(updated);
        toast({ title: "🗑️ Paiement supprimé" });
    };

    const handleNotImplemented = () => toast({ title: "🚧 Bientôt disponible" });

    const getEntityName = (id, collection) => {
        const item = collection.find(c => c.id === id);
        return item?.nom || item?.nomComplet || 'N/A';
    }

    const statusConfig = {
        'payé': { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
        'impayé': { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
        'en attente': { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' }
    };

    return (
        <>
            <Helmet><title>Paiements - ImmoGestion+</title></Helmet>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">Calendrier des Paiements</h1>
                        <p className="text-gray-600">Suivez les paiements et les impayés.</p>
                    </div>
                     <div className="flex gap-2">
                         <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
                            <DialogTrigger asChild>
                                <Button className="gradient-primary text-white shadow-lg"><Plus className="h-4 w-4 mr-2" /> Ajouter un paiement</Button>
                            </DialogTrigger>
                             <DialogContent>
                                <DialogHeader><DialogTitle>{editingPaiement ? 'Modifier le paiement' : 'Nouveau paiement'}</DialogTitle></DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                     <div>
                                        <Label>Contrat (Bien - Locataire) *</Label>
                                         <Select onValueChange={handleContratChange} value={formData.contratId} disabled={!!editingPaiement}>
                                             <SelectTrigger><SelectValue placeholder="Sélectionner un contrat..."/></SelectTrigger>
                                             <SelectContent>{contrats.filter(c => c.statut === 'actif').map(c => <SelectItem key={c.id} value={c.id}>{getEntityName(c.bienId, biens)} - {getEntityName(c.clientId, clients)}</SelectItem>)}</SelectContent>
                                         </Select>
                                     </div>
                                     <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Date du paiement *</Label>
                                            <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required/>
                                        </div>
                                         <div>
                                            <Label>Montant payé (FCFA) *</Label>
                                            <Input type="number" value={formData.montant} onChange={e => setFormData({...formData, montant: e.target.value})} required/>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                         <div>
                                            <Label>Statut *</Label>
                                             <Select onValueChange={v => setFormData({...formData, statut: v})} value={formData.statut}>
                                                 <SelectTrigger><SelectValue/></SelectTrigger>
                                                 <SelectContent>
                                                    <SelectItem value="payé">✅ Payé</SelectItem>
                                                    <SelectItem value="impayé">⚠️ Impayé</SelectItem>
                                                    <SelectItem value="en attente">⏳ En attente</SelectItem>
                                                 </SelectContent>
                                             </Select>
                                         </div>
                                         <div>
                                            <Label>Méthode de paiement *</Label>
                                             <Select onValueChange={v => setFormData({...formData, methode: v})} value={formData.methode}>
                                                 <SelectTrigger><SelectValue/></SelectTrigger>
                                                 <SelectContent>
                                                    <SelectItem value="espèces">Espèces</SelectItem>
                                                    <SelectItem value="virement">Virement bancaire</SelectItem>
                                                    <SelectItem value="mobile">Mobile money</SelectItem>
                                                 </SelectContent>
                                             </Select>
                                         </div>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                                        <Button type="submit" className="gradient-primary text-white">{editingPaiement ? 'Modifier' : 'Ajouter'}</Button>
                                    </div>
                                </form>
                             </DialogContent>
                         </Dialog>
                        <Button variant="outline" onClick={handleNotImplemented}>
                            <Download className="h-4 w-4 mr-2" /> Exporter PDF
                        </Button>
                    </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <Button variant="ghost" size="icon" onClick={handlePrevMonth}><ChevronLeft/></Button>
                        <h2 className="text-xl font-bold text-gray-800">{currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h2>
                        <Button variant="ghost" size="icon" onClick={handleNextMonth}><ChevronRight/></Button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-px">
                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">{day}</div>
                        ))}
                        {emptyDays.map((_, i) => <div key={`empty-${i}`} className="border-t border-l border-gray-100"></div>)}
                        {daysArray.map(day => {
                            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                            const dayString = dayDate.toISOString().split('T')[0];
                            const paiementsDuJour = generatedPaiements.filter(p => p.date === dayString);

                            return (
                                <div key={day} className="relative min-h-[120px] p-1.5 border-t border-l border-gray-100 flex flex-col gap-1 overflow-y-auto">
                                    <span className={cn(
                                        "font-semibold text-xs",
                                        new Date('2025-10-26').toDateString() === dayDate.toDateString() ? 'text-white bg-purple-600 rounded-full flex items-center justify-center h-5 w-5' : 'text-gray-600'
                                    )}>{day}</span>
                                    <div className="flex flex-col gap-1">
                                        {paiementsDuJour.map(p => {
                                            const config = statusConfig[p.statut];
                                            const contrat = contrats.find(c => c.id === p.contratId);
                                            if (!contrat) return null;
                                            const clientName = getEntityName(contrat.clientId, clients).split(' ')[0];
                                            return (
                                                <motion.div 
                                                    key={p.id} 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className={cn("p-1 rounded-md text-xs", config.bg)}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-1 font-semibold">
                                                          <config.icon className={cn("h-3 w-3", config.color)} />
                                                          <span className={cn("truncate", config.color)} title={clientName}>{clientName}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleEdit(p)}><Edit className="h-3 w-3 text-purple-600"/></Button>
                                                          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleDelete(p.id)}><Trash2 className="h-3 w-3 text-red-600"/></Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default Paiements;

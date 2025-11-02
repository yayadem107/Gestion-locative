
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Save, Building, Mail, Key, Users, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Parametres = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    nomEntreprise: '', adresse: '', telephone: '', email: '', logo: null, signature: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem('settings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    localStorage.setItem('settings', JSON.stringify(settings));
    toast({ title: '✅ Paramètres enregistrés' });
  };
  
  const handleNotImplemented = () => toast({ title: '🚧 Bientôt disponible' });

  return (
    <>
      <Helmet><title>Paramètres - ImmoGestion+</title></Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">Paramètres</h1>
            <p className="text-gray-600">Configurez les informations de votre entreprise.</p>
          </div>
          <Button onClick={handleSave} className="gradient-gold text-black shadow-lg">
            <Save className="h-4 w-4 mr-2" /> Enregistrer les modifications
          </Button>
        </div>

        <Tabs defaultValue="entreprise" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="entreprise">Entreprise</TabsTrigger>
            <TabsTrigger value="visuel">Logo & Signature</TabsTrigger>
            <TabsTrigger value="api">Intégrations</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>
          
          <motion.div initial={{ opacity: 0, y:10 }} animate={{ opacity: 1, y:0 }} transition={{ duration: 0.3 }}>
            <TabsContent value="entreprise" className="glass-effect rounded-2xl p-6 mt-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="nomEntreprise">Nom de l'entreprise</Label>
                        <Input id="nomEntreprise" value={settings.nomEntreprise} onChange={(e) => setSettings({...settings, nomEntreprise: e.target.value})} />
                    </div>
                    <div>
                        <Label htmlFor="adresse">Adresse</Label>
                        <Input id="adresse" value={settings.adresse} onChange={(e) => setSettings({...settings, adresse: e.target.value})} />
                    </div>
                     <div>
                        <Label htmlFor="telephone">Téléphone</Label>
                        <Input id="telephone" type="tel" value={settings.telephone} onChange={(e) => setSettings({...settings, telephone: e.target.value})} />
                    </div>
                     <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} />
                    </div>
               </div>
            </TabsContent>
            
            <TabsContent value="visuel" className="glass-effect rounded-2xl p-6 mt-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <Label>Logo de l'entreprise</Label>
                         <Button variant="outline" className="w-full" onClick={handleNotImplemented}><Upload className="h-4 w-4 mr-2" /> Importer un logo</Button>
                     </div>
                      <div>
                        <Label>Signature du gestionnaire</Label>
                         <Button variant="outline" className="w-full" onClick={handleNotImplemented}><Upload className="h-4 w-4 mr-2" /> Importer une signature</Button>
                     </div>
                 </div>
            </TabsContent>

            <TabsContent value="api" className="glass-effect rounded-2xl p-6 mt-4 text-center">
                <Key className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Configuration des API</h3>
                <p className="text-gray-500 mb-4">La connexion à WhatsApp et Gmail sera bientôt disponible.</p>
                <Button onClick={handleNotImplemented}>Configurer</Button>
            </TabsContent>
            
            <TabsContent value="users" className="glass-effect rounded-2xl p-6 mt-4 text-center">
                 <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                 <h3 className="text-lg font-semibold">Gestion des utilisateurs</h3>
                <p className="text-gray-500 mb-4">Ajoutez et gérez les accès des administrateurs et gestionnaires.</p>
                <Button onClick={handleNotImplemented}>Gérer les utilisateurs</Button>
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </>
  );
};

export default Parametres;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Proprietaires from '@/pages/Proprietaires';
import Clients from '@/pages/Clients';
import Biens from '@/pages/Biens';
import Contrats from '@/pages/Contrats';
import Paiements from '@/pages/Paiements';
import Factures from '@/pages/Factures';
import Parametres from '@/pages/Parametres';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Helmet>
        <title>ImmoGestion+ - Gestion Locative Immobilière</title>
        <meta name="description" content="Application complète de gestion locative immobilière pour gérer propriétaires, locataires, biens, contrats et paiements" />
      </Helmet>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/proprietaires" element={<Proprietaires />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/biens" element={<Biens />} />
            <Route path="/contrats" element={<Contrats />} />
            <Route path="/paiements" element={<Paiements />} />
            <Route path="/factures" element={<Factures />} />
            <Route path="/parametres" element={<Parametres />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
      <Toaster />
    </>
  );
}

export default App;

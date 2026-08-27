import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

import { 
  Plus, 
  Calendar, 
  DollarSign, 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Receipt, 
  Copy, 
  Check, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  PieChart as PieIcon, 
  Database, 
  Download, 
  Layers, 
  ChevronRight, 
  ClipboardPaste, 
  Image as ImageIcon, 
  Eye, 
  X, 
  RefreshCw, 
  Percent, 
  Upload, 
  Camera, 
  User, 
  Coins, 
  ChevronDown, 
  AlertTriangle,
  Globe,
  Languages,
  ShieldAlert,
  KeyRound,
  LogIn,
  LogOut,
  Cloud,
  CloudCheck,
  Sparkles
} from 'lucide-react';

// --- আপনার দেওয়া FIREBASE CONFIGURATION ---
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCDKwtfxNMmJarQui0MHhnq7sWXyB9L8XE",
  authDomain: "partner-tracker-2630d.firebaseapp.com",
  projectId: "partner-tracker-2630d",
  storageBucket: "partner-tracker-2630d.firebasestorage.app",
  messagingSenderId: "1043789007144",
  appId: "1:1043789007144:web:d1954a9d63ac045568281d",
  measurementId: "G-MQZ8P0NCSR"
};

// ইনিশিয়ালাইজেশন
const firebaseApp = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApp();
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// --- বহুভাষিক অনুবাদ ডিকশনারি ---
const TRANSLATIONS = {
  bn: {
    appTitle: 'IAP ম্যানেজার',
    appSubtitle: 'Google Play & পার্টনার ট্র্যাকার',
    totalAssigned: 'মোট বরাদ্দ / খরচ',
    usdRate: 'ডলার রেট',
    afterTaxProfit: 'After Tax Profit',
    totalEarnedAfterTax: 'Total $ Earned after tax',
    billingCycles: 'বিলিং সাইকেল সমূহ',
    newCycle: 'নতুন সাইকেল',
    viewPartners: 'পার্টনার লিস্ট',
    allCycles: 'সকল সাইকেল',
    partnersInCycle: 'এই সাইকেলের পার্টনার সমূহ',
    registeredPartners: 'জন পার্টনার অন্তর্ভুক্ত',
    partnersList: 'পার্টনারদের তালিকা',
    partnerClickHint: 'ট্রানজেকশন দেখতে পার্টনারের ওপর ক্লিক করুন',
    addPartner: '+ পার্টনার',
    partnerRole: 'রোল / পদবী',
    transactions: 'লেনদেন সমূহ',
    addTransaction: 'Add Transaction',
    spent: 'Spent',
    afterTax: 'After Tax',
    paidTk: 'Paid Tk (৳)',
    formulaSupport: 'ফর্মুলা সাপোর্ট করে (যেমন: 1200+105)',
    paste: 'পেস্ট করুন (Paste)',
    date: 'তারিখ',
    note: 'নোট / আইটেম',
    paymentProof: 'Payment Proof (Screenshot)',
    uploadScreenshot: 'স্ক্রিনশট আপলোড করুন',
    screenshotAttached: 'স্ক্রিনশট সংযুক্ত',
    delete: 'মুছে ফেলুন',
    cancel: 'বাতিল',
    save: 'সেভ করুন',
    saveTransaction: 'Save Transaction',
    savePartner: 'সেভ পার্টনার',
    editCycle: 'সাইকেল এডিট',
    editPartner: 'পার্টনার তথ্য এডিট',
    newPartnerTitle: 'নতুন পার্টনার যোগ করুন',
    editTransaction: 'Edit Transaction',
    addIapTx: 'Add IAP Transaction',
    switchMonth: 'মাসের সাইকেল সুইচ করুন',
    confirmRequired: 'নিরাপত্তা যাচাইকরণ',
    warning: 'সতর্কবার্তা',
    enterCodeToConfirm: 'Enter the code to confirm',
    enterCodePrompt: 'নিশ্চিত করতে নিচে দেখানো ৩ সংখ্যার কোডটি লিখুন:',
    deleteCyclePrompt: 'আপনি কি নিশ্চিতভাবে এই সাইকেল এবং এর অধীনস্থ সকল পার্টনার ও লেনদেন মুছে ফেলতে চান?',
    deletePartnerPrompt: 'আপনি কি নিশ্চিতভাবে এই পার্টনার এবং তার সমস্ত লেনদেন মুছে ফেলতে চান?',
    deleteTxPrompt: 'আপনি কি নিশ্চিতভাবে এই লেনদেনটি মুছে ফেলতে চান?',
    languageSettings: 'ভাষা পরিবর্তন (Language)',
    selectLanguage: 'অ্যাপ্লিকেশনের ভাষা নির্বাচন করুন',
    cloudSettings: 'Firebase ক্লাউড ডেটাবেজ',
    cloudSubtitle: 'Gmail লগইন ও রিয়েল-টাইম ক্লাউড স্টোরেজ',
    connected: 'সংযুক্ত',
    offlineMode: 'অফলাইন মোড',
    backupSection: 'ব্যাকআপ ও ডেটা রফতানি',
    exportBackup: 'ব্যাকআপ ফাইল এক্সপোর্ট (JSON)',
    financialAnalysis: 'ফাইন্যান্সিয়াল বিশ্লেষণ',
    grossReceived: 'মোট পেইড টাকা প্রাপ্তি',
    totalUsdCost: 'মোট After Tax USD (৭৫%)',
    usdCostInBdt: 'After Tax USD এর বিডিটি মূল্য',
    netProfit: 'মোট After Tax প্রফিট',
    noTransactions: 'এর জন্য কোন ট্রানজেকশন রেকর্ড নেই।',
    firstTxBtn: '+ প্রথম ট্রানজেকশন রেকর্ড করুন',
    noPartners: 'কোন পার্টনার নেই',
    firstPartnerBtn: '+ নতুন পার্টনার যোগ করুন',
    searchPlaceholder: 'TRX ID, তারিখ বা বিবরণ খুঁজুন...',
    copied: 'কপি করা হয়েছে!',
    pasted: 'TRX ID পেস্ট করা হয়েছে!',
    deletedSuccess: 'সফলভাবে মুছে ফেলা হয়েছে',
    savedSuccess: 'সফলভাবে সংরক্ষিত হয়েছে',
    loginWithGoogle: 'Google দিয়ে লগইন করুন',
    logout: 'লগআউট',
    loggedInAs: 'লগইন আছেন:',
    syncingCloud: 'ফায়ারবেস ক্লাউডে সিঙ্ক হচ্ছে...'
  },
  en: {
    appTitle: 'IAP Manager',
    appSubtitle: 'Google Play & Partner Tracker',
    totalAssigned: 'Total Assigned / Spent',
    usdRate: 'USD Rate',
    afterTaxProfit: 'After Tax Profit',
    totalEarnedAfterTax: 'Total $ Earned after tax',
    billingCycles: 'Billing Cycles',
    newCycle: 'New Cycle',
    viewPartners: 'View Partners',
    allCycles: 'All Active Cycles',
    partnersInCycle: 'Partners in this Cycle',
    registeredPartners: 'partners registered',
    partnersList: 'Partners Breakdown',
    partnerClickHint: 'Select a partner to view transaction sheet',
    addPartner: '+ Add Partner',
    partnerRole: 'Role / Tag',
    transactions: 'TRANSACTIONS',
    addTransaction: 'Add Transaction',
    spent: 'Spent',
    afterTax: 'After Tax',
    paidTk: 'Paid Tk (৳)',
    formulaSupport: 'Supports formulas e.g. "1200+105"',
    paste: 'Paste',
    date: 'Date',
    note: 'Item / Note',
    paymentProof: 'Payment Proof (Screenshot)',
    uploadScreenshot: 'Upload Screenshot',
    screenshotAttached: 'Screenshot attached',
    delete: 'Delete',
    cancel: 'Cancel',
    save: 'Save',
    saveTransaction: 'Save Transaction',
    savePartner: 'Save Partner',
    editCycle: 'Edit Cycle',
    editPartner: 'Edit Partner',
    newPartnerTitle: 'Add New Partner',
    editTransaction: 'Edit Transaction',
    addIapTx: 'Add IAP Transaction',
    switchMonth: 'Switch Billing Cycle',
    confirmRequired: 'Security Verification',
    warning: 'Warning',
    enterCodeToConfirm: 'Enter the code to confirm',
    enterCodePrompt: 'Type the 3-digit verification code to confirm deletion:',
    deleteCyclePrompt: 'Are you sure you want to delete this billing cycle and all related partner transactions?',
    deletePartnerPrompt: 'Are you sure you want to delete this partner and all their recorded transactions?',
    deleteTxPrompt: 'Are you sure you want to delete this transaction?',
    languageSettings: 'Language Settings',
    selectLanguage: 'Choose your preferred interface language',
    cloudSettings: 'Firebase Cloud Database',
    cloudSubtitle: 'Gmail login & real-time sync',
    connected: 'Connected',
    offlineMode: 'Local Mode',
    backupSection: 'Data Backup & Export',
    exportBackup: 'Export All Data (JSON)',
    financialAnalysis: 'Financial Analysis',
    grossReceived: 'Gross Paid Tk Received',
    totalUsdCost: 'Total USD Cost (After Tax 75%)',
    usdCostInBdt: 'Calculated Cost in BDT',
    netProfit: 'Net After Tax Profit',
    noTransactions: 'No transactions recorded yet.',
    firstTxBtn: '+ Record First Transaction',
    noPartners: 'No partners in this cycle',
    firstPartnerBtn: '+ Add First Partner',
    searchPlaceholder: 'Search TRX ID, note, amount...',
    copied: 'Copied to clipboard!',
    pasted: 'TRX ID pasted successfully!',
    deletedSuccess: 'Item deleted successfully',
    savedSuccess: 'Saved successfully',
    loginWithGoogle: 'Sign in with Google',
    logout: 'Logout',
    loggedInAs: 'Logged in as:',
    syncingCloud: 'Syncing to Firebase cloud...'
  }
};

// --- প্রাথমিক ডেমো ডেটা ---
const INITIAL_CYCLES = [
  {
    id: 'cycle-1',
    name: 'August - September 2026',
    startDate: '2026-08-01',
    endDate: '2026-09-01',
    usdRate: 122.5,
    targetBudgetTk: 250000,
    createdAt: '2026-08-01T00:00:00.000Z'
  },
  {
    id: 'cycle-2',
    name: 'July - August 2026',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    usdRate: 121.0,
    targetBudgetTk: 200000,
    createdAt: '2026-07-01T00:00:00.000Z'
  }
];

const INITIAL_PARTNERS = [
  { 
    id: 'part-1', 
    cycleId: 'cycle-1', 
    name: 'Arman', 
    role: 'মেইন পার্টনার', 
    avatarColor: 'bg-emerald-500',
    avatarUrl: null 
  },
  { 
    id: 'part-2', 
    cycleId: 'cycle-1', 
    name: 'Partner 2 (Tanvir)', 
    role: 'আইএপি বায়ার', 
    avatarColor: 'bg-indigo-500',
    avatarUrl: null 
  }
];

const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    cycleId: 'cycle-1',
    partnerId: 'part-1',
    trxId: 'GPA.8147-1937-1408-87291',
    date: '2026-08-27',
    amountUsd: 3.01,
    afterTaxUsd: 2.26,
    paidTk: 150,
    confirmedBy: 'Arman',
    note: 'In-App Purchase',
    proofImage: null
  }
];

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('iap_lang') || 'bn');
  const t = useMemo(() => TRANSLATIONS[lang] || TRANSLATIONS.bn, [lang]);

  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [cycles, setCycles] = useState(() => {
    const saved = localStorage.getItem('iap_cycles_fb');
    return saved ? JSON.parse(saved) : INITIAL_CYCLES;
  });

  const [partners, setPartners] = useState(() => {
    const saved = localStorage.getItem('iap_partners_fb');
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('iap_transactions_fb');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [activeScreen, setActiveScreen] = useState('cycles');
  const [selectedCycleId, setSelectedCycleId] = useState(cycles[0]?.id || 'cycle-1');
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);

  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [cycleModal, setCycleModal] = useState({ isOpen: false, mode: 'create', data: null });
  const [partnerModal, setPartnerModal] = useState({ isOpen: false, mode: 'create', data: null, name: '', role: '', avatarUrl: null });
  const [txModal, setTxModal] = useState({ isOpen: false, mode: 'create', data: null, amountUsd: '', afterTaxUsd: '', trxId: '', paidTk: '', confirmedBy: '', date: '', note: '', proofImage: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: '', id: null, title: '', message: '', requiredCode: '', inputCode: '' });
  const [viewProofModal, setViewProofModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef(null);
  const partnerPhotoInputRef = useRef(null);
  const monthDropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        showToast(currentUser.displayName ? `স্বাগতম, ${currentUser.displayName}` : 'লগইন সফল হয়েছে');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const cyclesCol = collection(db, 'users', user.uid, 'cycles');
    const unsubCycles = onSnapshot(cyclesCol, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setCycles(list);
      } else {
        cycles.forEach(c => setDoc(doc(db, 'users', user.uid, 'cycles', c.id), c));
      }
    }, (err) => console.error("Cycles load error:", err));

    const partnersCol = collection(db, 'users', user.uid, 'partners');
    const unsubPartners = onSnapshot(partnersCol, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setPartners(list);
      } else {
        partners.forEach(p => setDoc(doc(db, 'users', user.uid, 'partners', p.id), p));
      }
    }, (err) => console.error("Partners load error:", err));

    const txCol = collection(db, 'users', user.uid, 'transactions');
    const unsubTx = onSnapshot(txCol, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setTransactions(list);
      } else {
        transactions.forEach(t => setDoc(doc(db, 'users', user.uid, 'transactions', t.id), t));
      }
    }, (err) => console.error("Transactions load error:", err));

    return () => {
      unsubCycles();
      unsubPartners();
      unsubTx();
    };
  }, [user]);

  useEffect(() => {
    localStorage.setItem('iap_cycles_fb', JSON.stringify(cycles));
  }, [cycles]);

  useEffect(() => {
    localStorage.setItem('iap_partners_fb', JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem('iap_transactions_fb', JSON.stringify(transactions));
  }, [transactions]);

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('iap_lang', newLang);
    showToast(newLang === 'bn' ? 'বাংলা ভাষা সক্রিয় হয়েছে' : 'Language switched to English');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) {
        setIsMonthDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsAuthLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      showToast('Google দিয়ে সফলভাবে লগইন সম্পন্ন হয়েছে!');
    } catch (err) {
      console.error(err);
      showToast('Google Login ব্যর্থ হয়েছে।', 'error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      showToast('লগআউট সম্পন্ন হয়েছে');
    } catch (err) {
      console.error(err);
    }
  };

  const saveToFirestore = async (collectionName, docId, data) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid, collectionName, docId);
      await setDoc(docRef, data, { merge: true });
    } catch (err) {
      console.error("Firestore save error:", err);
    }
  };

  const deleteFromFirestore = async (collectionName, docId) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid, collectionName, docId);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Firestore delete error:", err);
    }
  };

  const copyToClipboard = (text, label = t.copied) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(label);
    } catch (err) {
      showToast('Copy failed', 'error');
    }
  };

  const handlePasteTrxId = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setTxModal(prev => ({ ...prev, trxId: text.trim() }));
          showToast(t.pasted);
          return;
        }
      }
      showToast('Please paste manually', 'info');
    } catch (err) {
      showToast('Clipboard access denied, paste manually', 'info');
    }
  };

  const handleProofUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('File size must be under 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setTxModal(prev => ({ ...prev, proofImage: reader.result }));
        showToast(t.screenshotAttached);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePartnerPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Photo size must be under 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPartnerModal(prev => ({ ...prev, avatarUrl: reader.result }));
        showToast(t.savedSuccess);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAmountChange = (val) => {
    const amountNum = parseFloat(val);
    if (!isNaN(amountNum) && amountNum >= 0) {
      const calculatedAfterTax = (amountNum * 0.75).toFixed(2);
      setTxModal(prev => ({
        ...prev,
        amountUsd: val,
        afterTaxUsd: calculatedAfterTax
      }));
    } else {
      setTxModal(prev => ({
        ...prev,
        amountUsd: val,
        afterTaxUsd: ''
      }));
    }
  };

  const currentCycle = useMemo(() => {
    return cycles.find(c => c.id === selectedCycleId) || cycles[0] || null;
  }, [cycles, selectedCycleId]);

  const currentPartner = useMemo(() => {
    return partners.find(p => p.id === selectedPartnerId) || null;
  }, [partners, selectedPartnerId]);

  const currentCyclePartners = useMemo(() => {
    if (!currentCycle) return [];
    return partners.filter(p => p.cycleId === currentCycle.id);
  }, [partners, currentCycle]);

  const currentCycleTransactions = useMemo(() => {
    if (!currentCycle) return [];
    return transactions.filter(t => t.cycleId === currentCycle.id);
  }, [transactions, currentCycle]);

  const currentPartnerTransactions = useMemo(() => {
    if (!selectedPartnerId || !currentCycle) return [];
    return transactions.filter(t => t.partnerId === selectedPartnerId && t.cycleId === currentCycle.id);
  }, [transactions, selectedPartnerId, currentCycle]);

  const getPartnerMetrics = (partnerId) => {
    const pTxs = transactions.filter(t => t.partnerId === partnerId && t.cycleId === currentCycle?.id);
    const totalPaidTk = pTxs.reduce((sum, t) => sum + (Number(t.paidTk) || 0), 0);
    const totalUsdSpent = pTxs.reduce((sum, t) => sum + (Number(t.amountUsd) || 0), 0);
    const totalAfterTaxUsd = pTxs.reduce((sum, t) => sum + (Number(t.afterTaxUsd) || 0), 0);

    const usdRate = currentCycle?.usdRate || 122.5;
    const afterTaxValueTk = totalAfterTaxUsd * usdRate;
    const netProfit = afterTaxValueTk >= totalPaidTk ? (afterTaxValueTk - totalPaidTk) : (totalPaidTk - afterTaxValueTk);
    const totalProfitTk = Math.max(0, netProfit || Math.abs(afterTaxValueTk - totalPaidTk));

    return {
      txCount: pTxs.length,
      totalPaidTk,
      totalUsdSpent,
      totalAfterTaxUsd,
      afterTaxValueTk,
      totalProfitTk
    };
  };

  const cycleMetrics = useMemo(() => {
    if (!currentCycle) return { totalPaidTk: 0, totalUsd: 0, totalAfterTaxUsd: 0, totalCostTk: 0, totalProfitTk: 0, txCount: 0 };
    const txs = currentCycleTransactions;
    const totalPaidTk = txs.reduce((acc, t) => acc + (Number(t.paidTk) || 0), 0);
    const totalUsd = txs.reduce((acc, t) => acc + (Number(t.amountUsd) || 0), 0);
    const totalAfterTaxUsd = txs.reduce((acc, t) => acc + (Number(t.afterTaxUsd) || 0), 0);
    const usdRate = currentCycle.usdRate || 122.5;
    
    const totalCostTk = totalAfterTaxUsd * usdRate;
    const netProfit = totalCostTk >= totalPaidTk ? (totalCostTk - totalPaidTk) : (totalPaidTk - totalCostTk);
    const totalProfitTk = Math.max(0, netProfit || Math.abs(totalCostTk - totalPaidTk));

    return {
      totalPaidTk,
      totalUsd,
      totalAfterTaxUsd,
      totalCostTk,
      totalProfitTk,
      txCount: txs.length
    };
  }, [currentCycle, currentCycleTransactions]);

  const parseTkInput = (input) => {
    if (typeof input === 'number') return input;
    if (!input) return 0;
    try {
      const sanitized = input.toString().replace(/[^0-9+\-*/.]/g, '');
      const result = Function(`'use strict'; return (${sanitized})`)();
      return isNaN(result) ? 0 : Number(result.toFixed(2));
    } catch (e) {
      const num = parseFloat(input);
      return isNaN(num) ? 0 : num;
    }
  };

  const handleSaveCycle = (cycleData) => {
    let newCycle;
    if (cycleModal.mode === 'create') {
      newCycle = {
        id: `cycle-${Date.now()}`,
        ...cycleData,
        createdAt: new Date().toISOString()
      };
      setCycles([newCycle, ...cycles]);
      setSelectedCycleId(newCycle.id);
    } else {
      newCycle = { ...cycleModal.data, ...cycleData };
      setCycles(cycles.map(c => c.id === newCycle.id ? newCycle : c));
    }
    saveToFirestore('cycles', newCycle.id, newCycle);
    setCycleModal({ isOpen: false, mode: 'create', data: null });
    showToast(t.savedSuccess);
  };

  const handleSavePartner = (e) => {
    e.preventDefault();
    if (!partnerModal.name.trim()) {
      showToast('Please enter partner name', 'error');
      return;
    }

    let pData;
    if (partnerModal.mode === 'create') {
      const colors = ['bg-emerald-500', 'bg-indigo-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500', 'bg-teal-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      pData = {
        id: `part-${Date.now()}`,
        cycleId: currentCycle.id,
        avatarColor: randomColor,
        name: partnerModal.name.trim(),
        role: partnerModal.role.trim() || 'Partner',
        avatarUrl: partnerModal.avatarUrl || null
      };
      setPartners([...partners, pData]);
    } else {
      pData = {
        ...partnerModal.data,
        name: partnerModal.name.trim(),
        role: partnerModal.role.trim(),
        avatarUrl: partnerModal.avatarUrl
      };
      setPartners(partners.map(p => p.id === pData.id ? pData : p));
    }
    saveToFirestore('partners', pData.id, pData);
    setPartnerModal({ isOpen: false, mode: 'create', data: null, name: '', role: '', avatarUrl: null });
    showToast(t.savedSuccess);
  };

  const openCreatePartnerModal = () => {
    setPartnerModal({
      isOpen: true,
      mode: 'create',
      data: null,
      name: '',
      role: lang === 'bn' ? 'মেইন পার্টনার' : 'Main Partner',
      avatarUrl: null
    });
  };

  const openEditPartnerModal = (partner) => {
    setPartnerModal({
      isOpen: true,
      mode: 'edit',
      data: partner,
      name: partner.name,
      role: partner.role || '',
      avatarUrl: partner.avatarUrl || null
    });
  };

  const handleSaveTransaction = (e) => {
    e.preventDefault();
    const parsedPaid = parseTkInput(txModal.paidTk);
    const amountUsd = parseFloat(txModal.amountUsd) || 0;
    const afterTaxUsd = parseFloat(txModal.afterTaxUsd) || (amountUsd * 0.75);

    if (!txModal.trxId) {
      showToast('Please provide TRX ID', 'error');
      return;
    }

    let txData;
    if (txModal.mode === 'create') {
      txData = {
        id: `tx-${Date.now()}`,
        cycleId: currentCycle.id,
        partnerId: selectedPartnerId || txModal.partnerId || currentCyclePartners[0]?.id,
        trxId: txModal.trxId.trim(),
        date: txModal.date || new Date().toISOString().split('T')[0],
        amountUsd: amountUsd,
        afterTaxUsd: Number(afterTaxUsd.toFixed(2)),
        paidTk: parsedPaid,
        confirmedBy: txModal.confirmedBy || (currentPartner ? currentPartner.name : 'Arman'),
        note: txModal.note || 'In-App Purchase',
        proofImage: txModal.proofImage || null
      };
      setTransactions([txData, ...transactions]);
    } else {
      txData = {
        ...txModal.data,
        trxId: txModal.trxId.trim(),
        date: txModal.date,
        amountUsd: amountUsd,
        afterTaxUsd: Number(afterTaxUsd.toFixed(2)),
        paidTk: parsedPaid,
        confirmedBy: txModal.confirmedBy,
        note: txModal.note,
        proofImage: txModal.proofImage
      };
      setTransactions(transactions.map(t => t.id === txData.id ? txData : t));
    }
    saveToFirestore('transactions', txData.id, txData);
    setTxModal({ isOpen: false, mode: 'create', data: null, amountUsd: '', afterTaxUsd: '', trxId: '', paidTk: '', confirmedBy: '', date: '', note: '', proofImage: null });
    showToast(t.savedSuccess);
  };

  const openCreateTxModal = (partnerId = selectedPartnerId) => {
    const partner = partners.find(p => p.id === partnerId) || currentPartner;
    setTxModal({
      isOpen: true,
      mode: 'create',
      data: null,
      partnerId: partnerId || currentCyclePartners[0]?.id,
      amountUsd: '',
      afterTaxUsd: '',
      trxId: '',
      paidTk: '',
      confirmedBy: partner ? partner.name : 'Arman',
      date: new Date().toISOString().split('T')[0],
      note: 'In-App Purchase',
      proofImage: null
    });
  };

  const openEditTxModal = (tx) => {
    setTxModal({
      isOpen: true,
      mode: 'edit',
      data: tx,
      partnerId: tx.partnerId,
      amountUsd: tx.amountUsd.toString(),
      afterTaxUsd: tx.afterTaxUsd.toString(),
      trxId: tx.trxId,
      paidTk: tx.paidTk.toString(),
      confirmedBy: tx.confirmedBy,
      date: tx.date,
      note: tx.note || '',
      proofImage: tx.proofImage || null
    });
  };

  const triggerDeleteConfirm = (type, id, title, message, e) => {
    e?.stopPropagation();
    const randomCode = Math.floor(100 + Math.random() * 900).toString();
    setDeleteConfirm({
      isOpen: true,
      type,
      id,
      title: title || t.warning,
      message: message || t.deleteTxPrompt,
      requiredCode: randomCode,
      inputCode: ''
    });
  };

  const executeDeleteAction = () => {
    const { type, id, requiredCode, inputCode } = deleteConfirm;
    
    if (inputCode.trim() !== requiredCode) {
      showToast('ভুল কোড! সঠিক ৩-সংখ্যার কোডটি লিখুন', 'error');
      return;
    }

    if (type === 'cycle') {
      if (cycles.length <= 1) {
        showToast('At least one cycle required', 'error');
        setDeleteConfirm({ isOpen: false, type: '', id: null, title: '', message: '', requiredCode: '', inputCode: '' });
        return;
      }
      setCycles(cycles.filter(c => c.id !== id));
      setPartners(partners.filter(p => p.cycleId !== id));
      setTransactions(transactions.filter(t => t.cycleId !== id));
      deleteFromFirestore('cycles', id);

      if (selectedCycleId === id) {
        const remaining = cycles.filter(c => c.id !== id);
        setSelectedCycleId(remaining[0]?.id || '');
      }
      setCycleModal({ isOpen: false, mode: 'create', data: null });
      showToast(t.deletedSuccess);
    } else if (type === 'partner') {
      setPartners(partners.filter(p => p.id !== id));
      setTransactions(transactions.filter(t => t.partnerId !== id));
      deleteFromFirestore('partners', id);

      if (selectedPartnerId === id) {
        setSelectedPartnerId(null);
        setActiveScreen('partner-summary');
      }
      setPartnerModal({ isOpen: false, mode: 'create', data: null, name: '', role: '', avatarUrl: null });
      showToast(t.deletedSuccess);
    } else if (type === 'transaction') {
      setTransactions(transactions.filter(t => t.id !== id));
      deleteFromFirestore('transactions', id);
      setTxModal({ isOpen: false, mode: 'create', data: null, amountUsd: '', afterTaxUsd: '', trxId: '', paidTk: '', confirmedBy: '', date: '', note: '', proofImage: null });
      showToast(t.deletedSuccess);
    }
    setDeleteConfirm({ isOpen: false, type: '', id: null, title: '', message: '', requiredCode: '', inputCode: '' });
  };

  return (
    <div className="min-h-screen bg-[#F3FAF8] text-slate-800 font-sans antialiased flex justify-center pb-24 md:pb-12">
      <div className="w-full max-w-md md:max-w-lg bg-white min-h-screen shadow-2xl relative flex flex-col overflow-x-hidden">

        {/* --- হেডার সেকশন --- */}
        <div className="relative bg-gradient-to-b from-[#3CA98D] to-[#34967C] text-white pt-6 pb-7 px-5 rounded-b-[36px] shadow-lg overflow-visible transition-all duration-300 z-20">
          <div className="absolute top-[-30px] right-[-20px] w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-[-20px] left-[-30px] w-36 h-36 rounded-full bg-emerald-300/15 blur-xl pointer-events-none" />

          {/* টপ ন্যাভিগেশন ও Month Switcher */}
          <div className="flex items-center justify-between relative z-30 mb-3">
            {activeScreen !== 'cycles' ? (
              <button
                onClick={() => {
                  if (activeScreen === 'partner-transactions') {
                    setActiveScreen('partner-summary');
                  } else {
                    setActiveScreen('cycles');
                  }
                }}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold shadow-inner">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
            )}

            {/* শীর্ষ Month Switcher */}
            <div className="relative flex-1 px-2 text-center" ref={monthDropdownRef}>
              <button
                onClick={() => setIsMonthDropdownOpen(prev => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-black/15 hover:bg-black/25 rounded-2xl border border-white/20 backdrop-blur-md transition text-white shadow-sm active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-200" />
                <span className="text-xs font-bold truncate max-w-[130px] md:max-w-[170px]">
                  {currentCycle?.name || t.switchMonth}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-emerald-200 transition-transform duration-200 ${isMonthDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Month Switcher ড্রপডাউন মেনু */}
              {isMonthDropdownOpen && (
                <div className="absolute top-11 left-1/2 -translate-x-1/2 w-72 bg-white text-slate-800 rounded-3xl shadow-2xl border border-slate-100 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex justify-between items-center">
                    <span>{t.switchMonth}</span>
                    <span className="text-emerald-600 font-bold">{cycles.length}</span>
                  </div>

                  <div className="max-h-60 overflow-y-auto py-1 divide-y divide-slate-50">
                    {cycles.map(cycle => {
                      const isSelected = cycle.id === selectedCycleId;
                      return (
                        <div
                          key={cycle.id}
                          className={`px-3.5 py-2 flex items-center justify-between transition hover:bg-slate-50 ${
                            isSelected ? 'bg-emerald-50/70 text-[#3CA98D]' : 'text-slate-700'
                          }`}
                        >
                          <div 
                            onClick={() => {
                              setSelectedCycleId(cycle.id);
                              setIsMonthDropdownOpen(false);
                              showToast(`Switched: ${cycle.name}`);
                            }}
                            className="flex-1 cursor-pointer pr-2 text-left truncate"
                          >
                            <span className="block text-xs font-bold truncate">{cycle.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{cycle.startDate} - {cycle.endDate}</span>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            {isSelected && <Check className="w-4 h-4 text-[#3CA98D] mr-1" />}
                            <button
                              onClick={(e) => {
                                setIsMonthDropdownOpen(false);
                                triggerDeleteConfirm(
                                  'cycle',
                                  cycle.id,
                                  t.editCycle,
                                  t.deleteCyclePrompt,
                                  e
                                );
                              }}
                              className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                              title={t.delete}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-100 px-3">
                    <button
                      onClick={() => {
                        setIsMonthDropdownOpen(false);
                        setCycleModal({ isOpen: true, mode: 'create', data: null });
                      }}
                      className="w-full py-2 bg-[#3CA98D] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow hover:bg-[#32947a] transition"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" /> {t.newCycle}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* কুইক প্লাস বাটন */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (activeScreen === 'cycles') {
                    setCycleModal({ isOpen: true, mode: 'create', data: null });
                  } else if (activeScreen === 'partner-summary') {
                    openCreatePartnerModal();
                  } else {
                    openCreateTxModal();
                  }
                }}
                className="w-10 h-10 rounded-full bg-white text-[#34967C] font-bold flex items-center justify-center shadow-md hover:bg-emerald-50 hover:scale-105 active:scale-95 transition"
                title="Add New"
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Gmail / Google Auth Status Bar */}
          <div className="bg-black/15 backdrop-blur-md rounded-2xl px-3.5 py-2 mb-3 border border-white/10 flex items-center justify-between text-xs">
            {user ? (
              <div className="flex items-center space-x-2.5 truncate">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full border border-white/40" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="truncate">
                  <span className="text-[11px] font-bold text-white block truncate">{user.displayName || user.email}</span>
                  <span className="text-[9px] text-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" /> Firebase Synced
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-emerald-100 text-[11px] font-medium flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5" /> অফলাইন মোড (Local Storage)
              </span>
            )}

            {user ? (
              <button
                onClick={handleSignOut}
                className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-xl text-[10px] font-bold transition flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" /> {t.logout}
              </button>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                disabled={isAuthLoading}
                className="px-3 py-1 bg-white text-[#34967C] hover:bg-emerald-50 rounded-xl text-[11px] font-black transition flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <LogIn className="w-3 h-3" /> {t.loginWithGoogle}
              </button>
            )}
          </div>

          {/* সার্বিক হিসাব ও রেট কার্ড */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-sm relative z-10">
            <div className="flex justify-between items-center text-xs text-emerald-100 font-medium mb-1">
              <span>{activeScreen === 'partner-transactions' ? `${currentPartner?.name}'s Total Paid` : t.totalAssigned}</span>
              <span className="bg-emerald-800/30 px-2.5 py-0.5 rounded-full text-[11px] text-emerald-100 border border-white/10">
                {t.usdRate}: ৳{currentCycle?.usdRate || 122.5}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div className="text-2xl md:text-3xl font-extrabold tracking-tight">
                ৳ {activeScreen === 'partner-transactions' 
                    ? getPartnerMetrics(selectedPartnerId).totalPaidTk.toLocaleString()
                    : cycleMetrics.totalPaidTk.toLocaleString()}
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-100 block font-medium">{t.afterTaxProfit}</span>
                <span className="text-base font-extrabold text-emerald-200 tracking-tight block">
                  +৳ {Math.round(activeScreen === 'partner-transactions' 
                    ? getPartnerMetrics(selectedPartnerId).totalProfitTk 
                    : cycleMetrics.totalProfitTk).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-xs">
              <span className="text-emerald-100 font-medium truncate max-w-[210px]">
                {activeScreen === 'partner-transactions' 
                  ? `${currentPartner?.name || 'Partner'}'s Total $ Earned after tax` 
                  : t.totalEarnedAfterTax}:
              </span>
              <span className="font-extrabold text-white text-sm bg-black/20 px-2.5 py-0.5 rounded-xl border border-white/15 shadow-inner">
                ${(activeScreen === 'partner-transactions' 
                  ? getPartnerMetrics(selectedPartnerId).totalAfterTaxUsd 
                  : cycleMetrics.totalAfterTaxUsd).toFixed(2)}
              </span>
            </div>

            <div className="w-full bg-black/15 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-emerald-300 h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(100, ((cycleMetrics.totalPaidTk / (currentCycle?.targetBudgetTk || 200000)) * 100))}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* --- মূল বডি ভিউ সমূহ --- */}
        <div className="flex-1 px-4 py-5 space-y-5">

          {/* স্ক্রিন ১: সাইকেল তালিকা */}
          {activeScreen === 'cycles' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.billingCycles}</span>
                  <button 
                    onClick={() => setCycleModal({ isOpen: true, mode: 'create', data: null })}
                    className="text-xs font-semibold text-[#3CA98D] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> {t.newCycle}
                  </button>
                </div>

                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                  {cycles.map(cycle => {
                    const isSelected = cycle.id === selectedCycleId;
                    return (
                      <button
                        key={cycle.id}
                        onClick={() => setSelectedCycleId(cycle.id)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 shadow-sm ${
                          isSelected 
                            ? 'bg-[#3CA98D] text-white shadow-emerald-200 shadow-md scale-102' 
                            : 'bg-white text-slate-600 border border-slate-100 hover:bg-emerald-50/50'
                        }`}
                      >
                        <Calendar className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                        <span>{cycle.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ডোনাট চার্ট কার্ড */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm relative">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">{currentCycle?.name}</h3>
                    <p className="text-xs text-slate-400">{currentCycle?.startDate} — {currentCycle?.endDate}</p>
                  </div>
                  <button
                    onClick={() => setCycleModal({ isOpen: true, mode: 'edit', data: currentCycle })}
                    className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#3CA98D] hover:bg-emerald-50 transition"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-center py-4 relative">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" stroke="#EAF5F2" strokeWidth="12" fill="transparent" />
                      <circle
                        cx="50" cy="50" r="38" stroke="#3CA98D" strokeWidth="12"
                        strokeDasharray="238"
                        strokeDashoffset={238 - (238 * Math.min(1, cycleMetrics.totalPaidTk / (currentCycle?.targetBudgetTk || 250000)) * 0.75)}
                        strokeLinecap="round" fill="transparent"
                      />
                      <circle
                        cx="50" cy="50" r="38" stroke="#5E81F4" strokeWidth="12"
                        strokeDasharray="238" strokeDashoffset="200"
                        strokeLinecap="round" fill="transparent"
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-[11px] font-medium text-slate-400">Total Paid (Tk)</span>
                      <span className="text-lg font-black text-slate-800">৳{cycleMetrics.totalPaidTk.toLocaleString()}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                        {cycleMetrics.txCount} {lang === 'bn' ? 'টি লেনদেন' : 'Trx'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-100">
                  <div className="bg-[#EEF2FF] text-[#4F46E5] p-2.5 rounded-2xl text-center">
                    <span className="text-[10px] block font-medium opacity-80">After Tax ($)</span>
                    <span className="text-xs font-bold">${cycleMetrics.totalAfterTaxUsd.toFixed(2)}</span>
                  </div>
                  <div className="bg-[#FAF5FF] text-[#9333EA] p-2.5 rounded-2xl text-center">
                    <span className="text-[10px] block font-medium opacity-80">{t.usdRate}</span>
                    <span className="text-xs font-bold">৳{currentCycle?.usdRate}</span>
                  </div>
                  <div className="p-2.5 rounded-2xl text-center bg-emerald-50 text-[#2D8A72]">
                    <span className="text-[10px] block font-medium opacity-80">{t.afterTaxProfit}</span>
                    <span className="text-xs font-bold">+৳{Math.round(cycleMetrics.totalProfitTk).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* পার্টনার শর্টকাট কার্ড */}
              <div className="bg-gradient-to-r from-[#3CA98D]/10 to-[#5E81F4]/10 rounded-3xl p-5 border border-[#3CA98D]/20 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{t.partnersInCycle}</h4>
                  <p className="text-xs text-slate-500">{currentCyclePartners.length} {t.registeredPartners}</p>
                </div>
                <button
                  onClick={() => setActiveScreen('partner-summary')}
                  className="px-4 py-2 bg-[#3CA98D] text-white rounded-2xl text-xs font-bold shadow-md hover:bg-[#32947a] transition flex items-center gap-1.5 active:scale-95"
                >
                  <span>{t.viewPartners}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* সব সাইকেল তালিকা */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">{t.allCycles}</h3>
                {cycles.map(c => {
                  const cTxs = transactions.filter(t => t.cycleId === c.id);
                  const cPaidTk = cTxs.reduce((sum, t) => sum + (Number(t.paidTk) || 0), 0);
                  const cUsd = cTxs.reduce((sum, t) => sum + (Number(t.afterTaxUsd) || 0), 0);
                  const cCostTk = cUsd * (c.usdRate || 122.5);
                  const cProfit = Math.max(0, cCostTk >= cPaidTk ? cCostTk - cPaidTk : cPaidTk - cCostTk);

                  return (
                    <div 
                      key={c.id}
                      onClick={() => {
                        setSelectedCycleId(c.id);
                        setActiveScreen('partner-summary');
                      }}
                      className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:border-[#3CA98D]/40 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#3CA98D] flex items-center justify-center font-bold">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#3CA98D] transition">{c.name}</h4>
                          <span className="text-xs text-slate-400 block">{c.startDate} — {c.endDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-slate-800 block">৳ {cPaidTk.toLocaleString()}</span>
                          <span className="text-[11px] font-bold text-emerald-600">
                            +৳{Math.round(cProfit).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={(e) => triggerDeleteConfirm('cycle', c.id, t.editCycle, t.deleteCyclePrompt, e)}
                          className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          title={t.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* স্ক্রিন ২: পার্টনার সামারি */}
          {activeScreen === 'partner-summary' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{t.partnersList}</h3>
                  <p className="text-xs text-slate-400">{t.partnerClickHint}</p>
                </div>
                <button
                  onClick={openCreatePartnerModal}
                  className="px-3 py-1.5 bg-[#3CA98D] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow hover:bg-[#32947a] transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> {t.addPartner}
                </button>
              </div>

              <div className="space-y-3">
                {currentCyclePartners.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-6">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-600">{t.noPartners}</h4>
                    <button
                      onClick={openCreatePartnerModal}
                      className="mt-4 px-4 py-2 bg-[#3CA98D] text-white text-xs font-bold rounded-full shadow"
                    >
                      {t.firstPartnerBtn}
                    </button>
                  </div>
                ) : (
                  currentCyclePartners.map(partner => {
                    const metrics = getPartnerMetrics(partner.id);
                    return (
                      <div
                        key={partner.id}
                        onClick={() => {
                          setSelectedPartnerId(partner.id);
                          setActiveScreen('partner-transactions');
                        }}
                        className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#3CA98D]/40 transition cursor-pointer relative group"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                          <div className="flex items-center space-x-3">
                            {partner.avatarUrl ? (
                              <img src={partner.avatarUrl} alt={partner.name} className="w-11 h-11 rounded-2xl object-cover border border-emerald-100 shadow-sm" />
                            ) : (
                              <div className={`w-11 h-11 rounded-2xl ${partner.avatarColor || 'bg-emerald-500'} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                                {partner.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                {partner.name}
                                <span className="text-[10px] font-normal bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                  {partner.role || 'Partner'}
                                </span>
                              </h4>
                              <span className="text-xs text-slate-400">{metrics.txCount} {lang === 'bn' ? 'টি লেনদেন' : 'Transactions'}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditPartnerModal(partner);
                              }}
                              className="p-1.5 text-slate-300 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => triggerDeleteConfirm('partner', partner.id, t.editPartner, t.deletePartnerPrompt, e)}
                              className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                              title={t.delete}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#3CA98D] group-hover:translate-x-0.5 transition" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div className="bg-[#F8FAF9] p-3 rounded-2xl">
                            <span className="text-[11px] font-semibold text-slate-400 block">Total Tk Spent (Paid)</span>
                            <span className="text-base font-extrabold text-slate-800 block mt-0.5">
                              ৳ {metrics.totalPaidTk.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">After Tax: ${metrics.totalAfterTaxUsd.toFixed(2)}</span>
                          </div>

                          <div className="p-3 rounded-2xl bg-emerald-50/70 text-[#247560]">
                            <span className="text-[11px] font-semibold opacity-80 block">{t.afterTaxProfit}</span>
                            <span className="text-base font-extrabold block mt-0.5 text-emerald-700">
                              +৳ {Math.round(metrics.totalProfitTk).toLocaleString()}
                            </span>
                            <span className="text-[10px] opacity-75 font-semibold text-emerald-600">
                              Margin: {metrics.totalPaidTk > 0 ? ((metrics.totalProfitTk / metrics.totalPaidTk) * 100).toFixed(1) : 0}%
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openCreateTxModal(partner.id);
                            }}
                            className="text-xs font-semibold text-[#3CA98D] hover:text-[#2d8770] flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> {t.addTransaction}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* স্ক্রিন ৩: পার্টনার ট্রানজেকশন তালিকা */}
          {activeScreen === 'partner-transactions' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {currentPartner?.avatarUrl ? (
                    <img src={currentPartner.avatarUrl} alt={currentPartner.name} className="w-12 h-12 rounded-2xl object-cover border border-emerald-100 shadow-sm" />
                  ) : (
                    <div className={`w-12 h-12 rounded-2xl ${currentPartner?.avatarColor || 'bg-emerald-500'} text-white flex items-center justify-center font-bold text-base shadow-sm`}>
                      {currentPartner?.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{currentPartner?.name}</h3>
                    <span className="text-xs text-slate-400">{currentCycle?.name}</span>
                  </div>
                </div>

                <button
                  onClick={() => openCreateTxModal(selectedPartnerId)}
                  className="px-3.5 py-2 bg-[#3CA98D] text-white rounded-2xl text-xs font-bold flex items-center gap-1 shadow-md hover:bg-[#32947a] transition active:scale-95"
                >
                  <Plus className="w-4 h-4" /> {t.addTransaction}
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white rounded-2xl text-xs border border-slate-200 focus:outline-none focus:border-[#3CA98D] shadow-sm"
                />
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center px-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>{t.transactions} ({currentPartnerTransactions.length})</span>
                  <span>PAID TK (৳)</span>
                </div>

                {currentPartnerTransactions.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200 p-6">
                    <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">{currentPartner?.name} {t.noTransactions}</p>
                    <button
                      onClick={() => openCreateTxModal(selectedPartnerId)}
                      className="mt-3 px-4 py-1.5 bg-[#3CA98D] text-white text-xs font-bold rounded-full shadow"
                    >
                      {t.firstTxBtn}
                    </button>
                  </div>
                ) : (
                  currentPartnerTransactions
                    .filter(tx => {
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase();
                      return (
                        tx.trxId?.toLowerCase().includes(q) ||
                        tx.note?.toLowerCase().includes(q) ||
                        tx.confirmedBy?.toLowerCase().includes(q) ||
                        tx.paidTk?.toString().includes(q)
                      );
                    })
                    .map(tx => {
                      const afterTaxDollar = tx.afterTaxUsd !== undefined ? tx.afterTaxUsd : (tx.amountUsd * 0.75);
                      const usdCostTk = afterTaxDollar * (currentCycle?.usdRate || 122.5);
                      const txProfit = Math.round(Math.abs(usdCostTk - (tx.paidTk || 0)));

                      return (
                        <div
                          key={tx.id}
                          onClick={() => openEditTxModal(tx)}
                          className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:border-[#3CA98D]/40 transition cursor-pointer flex flex-col space-y-2.5 group relative"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-xs font-bold text-slate-800 bg-[#F1F5F9] px-2.5 py-1 rounded-xl">
                                {tx.trxId}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(tx.trxId);
                                }}
                                className="p-1 text-slate-400 hover:text-[#3CA98D] transition"
                                title="Copy TRX ID"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-slate-400 font-medium">{tx.date}</span>
                              <button
                                onClick={(e) => triggerDeleteConfirm('transaction', tx.id, t.editTransaction, t.deleteTxPrompt, e)}
                                className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title={t.delete}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-700 font-medium truncate max-w-[180px]">
                                {tx.note || 'In-App Purchase'}
                              </span>
                              {tx.proofImage && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setViewProofModal(tx.proofImage);
                                  }}
                                  className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-50 text-[#3CA98D] px-1.5 py-0.5 rounded-md font-semibold hover:bg-emerald-100"
                                  title="View Proof"
                                >
                                  <ImageIcon className="w-3 h-3" /> {lang === 'bn' ? 'রসিদ' : 'Proof'}
                                </button>
                              )}
                            </div>
                            <span className="text-xs text-slate-400">
                              By: <strong className="text-slate-700 font-bold">{tx.confirmedBy}</strong>
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="bg-[#EEF2FF] text-[#4F46E5] px-2.5 py-0.5 rounded-lg font-bold text-xs">
                                {t.spent}: ${tx.amountUsd}
                              </span>
                              <span className="text-slate-400 text-xs font-medium">
                                {t.afterTax}: ${afterTaxDollar}
                              </span>
                            </div>

                            <div className="flex items-center space-x-3">
                              <span className="text-xs font-black text-emerald-600 tracking-tight">
                                +৳{txProfit}
                              </span>
                              <span className="text-base font-black text-slate-900 tracking-tight">
                                ৳ {Number(tx.paidTk).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          )}

          {/* স্ক্রিন ৪: অ্যানালিটিক্স */}
          {activeScreen === 'analytics' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-1">{t.financialAnalysis}</h3>
                <p className="text-xs text-slate-400 mb-4">{currentCycle?.name}</p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-emerald-50/60 rounded-2xl">
                    <span className="text-xs font-semibold text-slate-700">{t.grossReceived}</span>
                    <span className="text-sm font-bold text-emerald-800">৳ {cycleMetrics.totalPaidTk.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-indigo-50/60 rounded-2xl">
                    <span className="text-xs font-semibold text-slate-700">{t.totalUsdCost}</span>
                    <span className="text-sm font-bold text-indigo-800">${cycleMetrics.totalAfterTaxUsd.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                    <span className="text-xs font-semibold text-slate-700">{t.usdCostInBdt}</span>
                    <span className="text-sm font-bold text-slate-800">৳ {Math.round(cycleMetrics.totalCostTk).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50/80 rounded-2xl">
                    <span className="text-xs font-semibold text-slate-700">{t.netProfit}</span>
                    <span className="text-sm font-black text-emerald-700">+৳ {Math.round(cycleMetrics.totalProfitTk).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* স্ক্রিন ৫: সেটিংস */}
          {activeScreen === 'settings' && (
            <div className="space-y-4">
              {/* ভাষা পরিবর্তন */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Languages className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{t.languageSettings}</h3>
                    <p className="text-xs text-slate-400">{t.selectLanguage}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => handleLanguageChange('bn')}
                    className={`py-3 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                      lang === 'bn' 
                        ? 'bg-[#3CA98D] text-white border-[#3CA98D] shadow-md shadow-emerald-100' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>বাংলা (Bangla)</span>
                    {lang === 'bn' && <Check className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`py-3 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                      lang === 'en' 
                        ? 'bg-[#3CA98D] text-white border-[#3CA98D] shadow-md shadow-emerald-100' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>English</span>
                    {lang === 'en' && <Check className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Firebase Cloud Sync */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#3CA98D] flex items-center justify-center font-bold">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{t.cloudSettings}</h3>
                      <p className="text-xs text-slate-400">{t.cloudSubtitle}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    user ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {user ? t.connected : t.offlineMode}
                  </span>
                </div>

                {user ? (
                  <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-emerald-200" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#3CA98D] text-white flex items-center justify-center font-bold text-xs">
                            {user.email?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{user.displayName || 'Google User'}</span>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[170px]">{user.email}</span>
                        </div>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <LogOut className="w-3.5 h-3.5" /> {t.logout}
                      </button>
                    </div>
                    <p className="text-[10px] text-emerald-700 font-medium">
                      ✓ সকল ডেটা আপনার Firebase Cloud Firestore-এ স্বয়ংক্রিয়ভাবে সিঙ্ক হচ্ছে।
                    </p>
                  </div>
                ) : (
                  <div className="pt-1">
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={isAuthLoading}
                      className="w-full py-3 bg-[#3CA98D] hover:bg-[#32947a] text-white rounded-2xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition active:scale-95"
                    >
                      <LogIn className="w-4 h-4" /> {t.loginWithGoogle}
                    </button>
                  </div>
                )}
              </div>

              {/* ব্যাকআপ ও রিসেট */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.backupSection}</h4>
                
                <button
                  onClick={() => {
                    const exportData = {
                      cycles,
                      partners,
                      transactions,
                      exportedAt: new Date().toISOString()
                    };
                    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `iap_tracker_backup_${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    showToast('Backup downloaded successfully!');
                  }}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl text-xs font-bold border border-slate-200 transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> {t.exportBackup}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* --- বটম ন্যাভিগেশন বার --- */}
        <div className="fixed bottom-0 max-w-md md:max-w-lg w-full bg-white/90 backdrop-blur-lg border-t border-slate-100 py-2.5 px-6 flex justify-around items-center z-30 shadow-lg">
          <button
            onClick={() => setActiveScreen('cycles')}
            className={`flex flex-col items-center space-y-1 transition ${
              activeScreen === 'cycles' ? 'text-[#3CA98D] scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] font-bold">{lang === 'bn' ? 'সাইকেল' : 'Cycles'}</span>
          </button>

          <button
            onClick={() => setActiveScreen('partner-summary')}
            className={`flex flex-col items-center space-y-1 transition ${
              activeScreen === 'partner-summary' || activeScreen === 'partner-transactions' 
                ? 'text-[#3CA98D] scale-105' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold">{lang === 'bn' ? 'পার্টনার' : 'Partners'}</span>
          </button>

          <button
            onClick={() => setActiveScreen('analytics')}
            className={`flex flex-col items-center space-y-1 transition ${
              activeScreen === 'analytics' ? 'text-[#3CA98D] scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <PieIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold">{lang === 'bn' ? 'অ্যানালিটিক্স' : 'Analytics'}</span>
          </button>

          <button
            onClick={() => setActiveScreen('settings')}
            className={`flex flex-col items-center space-y-1 transition ${
              activeScreen === 'settings' ? 'text-[#3CA98D] scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Database className="w-5 h-5" />
            <span className="text-[10px] font-bold">{lang === 'bn' ? 'সেটিংস' : 'Settings'}</span>
          </button>
        </div>

        {/* ==================================================== */}
        {/* মোডাল ১: ট্রানজেকশন ফরম                              */}
        {/* ==================================================== */}
        {txModal.isOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {txModal.mode === 'create' ? t.addIapTx : t.editTransaction}
                  </h3>
                  <span className="text-[11px] text-slate-400">Google Play 25% Tax Auto-Cut</span>
                </div>
                <button 
                  onClick={() => setTxModal({ isOpen: false, mode: 'create', data: null, amountUsd: '', afterTaxUsd: '', trxId: '', paidTk: '', confirmedBy: '', date: '', note: '', proofImage: null })}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTransaction} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Partner</label>
                    <select
                      value={txModal.partnerId || selectedPartnerId || currentCyclePartners[0]?.id}
                      onChange={(e) => setTxModal(prev => ({ ...prev, partnerId: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CA98D] bg-white font-medium"
                    >
                      {currentCyclePartners.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Payment Confirmed By</label>
                    <input
                      type="text"
                      placeholder="Arman"
                      value={txModal.confirmedBy}
                      onChange={(e) => setTxModal(prev => ({ ...prev, confirmedBy: e.target.value }))}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CA98D] font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block font-semibold text-slate-700">Amount ($)</label>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">Google IAP</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 3.01"
                      value={txModal.amountUsd}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CA98D] font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block font-semibold text-slate-700">After Tax ($)</label>
                      <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.2 rounded">-25% Cut</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 2.26"
                      value={txModal.afterTaxUsd}
                      onChange={(e) => setTxModal(prev => ({ ...prev, afterTaxUsd: e.target.value }))}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CA98D] font-bold text-indigo-700 bg-indigo-50/30"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-semibold text-slate-600">{t.paidTk}</label>
                    <span className="text-[10px] text-slate-400">{t.formulaSupport}</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 150 or 1305"
                    value={txModal.paidTk}
                    onChange={(e) => setTxModal(prev => ({ ...prev, paidTk: e.target.value }))}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CA98D] font-black text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-semibold text-slate-600">TRX ID (GPA)</label>
                    <button
                      type="button"
                      onClick={handlePasteTrxId}
                      className="text-[11px] font-bold text-[#3CA98D] hover:text-[#2d8770] flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 transition active:scale-95"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5" /> {t.paste}
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. GPA.8147-1937-1408-87291"
                    value={txModal.trxId}
                    onChange={(e) => setTxModal(prev => ({ ...prev, trxId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CA98D] font-mono text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">{t.date}</label>
                    <input
                      type="date"
                      value={txModal.date}
                      onChange={(e) => setTxModal(prev => ({ ...prev, date: e.target.value }))}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CA98D]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">{t.note}</label>
                    <input
                      type="text"
                      placeholder="In-App Purchase"
                      value={txModal.note}
                      onChange={(e) => setTxModal(prev => ({ ...prev, note: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CA98D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">{t.paymentProof}</label>
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handleProofUpload} className="hidden" />

                  {txModal.proofImage ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img src={txModal.proofImage} alt="Proof" className="w-12 h-12 object-cover rounded-xl border" />
                        <span className="text-[11px] font-medium text-slate-600">{t.screenshotAttached}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button type="button" onClick={() => setViewProofModal(txModal.proofImage)} className="p-1.5 text-slate-600 hover:text-[#3CA98D] hover:bg-white rounded-lg transition" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => setTxModal(prev => ({ ...prev, proofImage: null }))} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition" title="Remove">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 border border-dashed border-slate-300 rounded-2xl hover:border-[#3CA98D] bg-slate-50/50 hover:bg-emerald-50/30 transition flex items-center justify-center gap-2 text-slate-600"
                    >
                      <Upload className="w-4 h-4 text-[#3CA98D]" />
                      <span className="text-xs font-semibold">{t.uploadScreenshot}</span>
                    </button>
                  )}
                </div>

                <div className="pt-3 flex space-x-2">
                  {txModal.mode === 'edit' && (
                    <button
                      type="button"
                      onClick={(e) => triggerDeleteConfirm('transaction', txModal.data.id, t.editTransaction, t.deleteTxPrompt, e)}
                      className="px-3 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition"
                    >
                      {t.delete}
                    </button>
                  )}
                  <button type="submit" className="flex-1 py-2.5 bg-[#3CA98D] text-white rounded-xl font-bold shadow hover:bg-[#32947a] transition">
                    {t.saveTransaction}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* মোডাল ২: পার্টনার মোডাল                              */}
        {/* ==================================================== */}
        {partnerModal.isOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-800">
                  {partnerModal.mode === 'create' ? t.newPartnerTitle : t.editPartner}
                </h3>
                <button onClick={() => setPartnerModal({ isOpen: false, mode: 'create', data: null, name: '', role: '', avatarUrl: null })} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePartner} className="space-y-4 text-xs">
                <div className="flex flex-col items-center justify-center space-y-2 py-1">
                  <input type="file" ref={partnerPhotoInputRef} accept="image/*" onChange={handlePartnerPhotoUpload} className="hidden" />

                  <div className="relative group">
                    {partnerModal.avatarUrl ? (
                      <div className="relative">
                        <img src={partnerModal.avatarUrl} alt="Preview" className="w-20 h-20 rounded-3xl object-cover border-2 border-[#3CA98D] shadow-md" />
                        <button type="button" onClick={() => setPartnerModal(prev => ({ ...prev, avatarUrl: null }))} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow hover:bg-rose-600 transition" title="Remove Photo">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div onClick={() => partnerPhotoInputRef.current?.click()} className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-dashed border-[#3CA98D]/50 flex flex-col items-center justify-center text-[#3CA98D] cursor-pointer hover:bg-emerald-100/50 transition">
                        <Camera className="w-6 h-6 mb-1 opacity-80" />
                        <span className="text-[10px] font-bold">{lang === 'bn' ? 'ফটো দিন' : 'Add Photo'}</span>
                      </div>
                    )}

                    {!partnerModal.avatarUrl && (
                      <button type="button" onClick={() => partnerPhotoInputRef.current?.click()} className="absolute bottom-0 right-0 bg-[#3CA98D] text-white p-1.5 rounded-full shadow-md hover:bg-[#32947a] transition" title="Upload">
                        <Plus className="w-3 h-3 stroke-[3]" />
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{lang === 'bn' ? 'পার্টনারের প্রোফাইল ছবি আপলোড' : 'Upload Partner Profile Photo'}</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">{lang === 'bn' ? 'পার্টনারের নাম' : 'Partner Name'}</label>
                  <input
                    type="text"
                    placeholder="e.g. Arman, Tanvir"
                    value={partnerModal.name}
                    onChange={(e) => setPartnerModal(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CA98D] font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">{t.partnerRole}</label>
                  <input
                    type="text"
                    placeholder="e.g. Main Reseller, Buyer"
                    value={partnerModal.role}
                    onChange={(e) => setPartnerModal(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CA98D]"
                  />
                </div>

                <div className="pt-2 flex space-x-2">
                  <button type="button" onClick={() => setPartnerModal({ isOpen: false, mode: 'create', data: null, name: '', role: '', avatarUrl: null })} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition">
                    {t.cancel}
                  </button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#3CA98D] text-white rounded-xl font-bold shadow hover:bg-[#32947a] transition">
                    {t.savePartner}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* মোডাল ৩: সাইকেল মোডাল                                */}
        {/* ==================================================== */}
        {cycleModal.isOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-800">
                  {cycleModal.mode === 'create' ? t.newCycle : t.editCycle}
                </h3>
                <button onClick={() => setCycleModal({ isOpen: false, mode: 'create', data: null })} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleSaveCycle({
                  ...(cycleModal.data || {}),
                  name: formData.get('name'),
                  startDate: formData.get('startDate'),
                  endDate: formData.get('endDate'),
                  usdRate: parseFloat(formData.get('usdRate')) || 122.5,
                  targetBudgetTk: parseFloat(formData.get('targetBudgetTk')) || 200000
                });
              }} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">{lang === 'bn' ? 'সাইকেলের নাম' : 'Cycle Name'}</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={cycleModal.data?.name || 'August - September 2026'}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CA98D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">{lang === 'bn' ? 'শুরুর তারিখ' : 'Start Date'}</label>
                    <input
                      type="date"
                      name="startDate"
                      defaultValue={cycleModal.data?.startDate || '2026-08-01'}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CA98D]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">{lang === 'bn' ? 'শেষের তারিখ' : 'End Date'}</label>
                    <input
                      type="date"
                      name="endDate"
                      defaultValue={cycleModal.data?.endDate || '2026-09-01'}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CA98D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">{t.usdRate} (৳)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="usdRate"
                      defaultValue={cycleModal.data?.usdRate || 122.5}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CA98D]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">{lang === 'bn' ? 'টার্গেট বাজেট (৳)' : 'Budget Goal (৳)'}</label>
                    <input
                      type="number"
                      name="targetBudgetTk"
                      defaultValue={cycleModal.data?.targetBudgetTk || 250000}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#3CA98D]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex space-x-2">
                  {cycleModal.mode === 'edit' && (
                    <button
                      type="button"
                      onClick={(e) => triggerDeleteConfirm('cycle', cycleModal.data.id, t.editCycle, t.deleteCyclePrompt, e)}
                      className="px-3 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition"
                    >
                      {t.delete}
                    </button>
                  )}
                  <button type="submit" className="flex-1 py-2.5 bg-[#3CA98D] text-white rounded-xl font-bold shadow hover:bg-[#32947a] transition">
                    {t.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* মোডাল ৪: ৩-সংখ্যার কোড ভেরিফিকেশন ডিলিট মোডাল (z-[100]) */}
        {/* ==================================================== */}
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 border border-rose-100 animate-in zoom-in-95 duration-150">
              <div className="flex items-center space-x-3 text-rose-600">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{deleteConfirm.title}</h3>
                  <span className="text-[10px] text-rose-500 font-semibold uppercase tracking-wider">{t.confirmRequired}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {deleteConfirm.message}
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block">
                  {t.enterCodeToConfirm}
                </span>

                <div className="inline-flex items-center justify-center bg-white px-5 py-2 rounded-2xl border-2 border-rose-400 text-rose-600 font-mono font-black text-2xl tracking-[0.3em] shadow-inner select-none">
                  {deleteConfirm.requiredCode}
                </div>

                <p className="text-[10px] text-slate-400">
                  {t.enterCodePrompt}
                </p>

                <input
                  type="text"
                  maxLength={3}
                  placeholder="---"
                  value={deleteConfirm.inputCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setDeleteConfirm(prev => ({ ...prev, inputCode: val }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && deleteConfirm.inputCode.trim() === deleteConfirm.requiredCode) {
                      executeDeleteAction();
                    }
                  }}
                  autoFocus
                  className="w-32 mx-auto text-center font-mono text-xl font-black tracking-widest px-3 py-2 bg-white rounded-xl border-2 border-slate-300 focus:outline-none focus:border-rose-500 text-slate-900 shadow-sm"
                />
              </div>

              <div className="pt-1 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm({ isOpen: false, type: '', id: null, title: '', message: '', requiredCode: '', inputCode: '' })}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  disabled={deleteConfirm.inputCode.trim() !== deleteConfirm.requiredCode}
                  onClick={executeDeleteAction}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition shadow-md ${
                    deleteConfirm.inputCode.trim() === deleteConfirm.requiredCode
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 active:scale-95 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* মোডাল ৫: স্ক্রিনশট প্রিভিউয়ার                       */}
        {/* ==================================================== */}
        {viewProofModal && (
          <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white max-w-sm w-full rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-150">
              <div className="p-3 flex justify-between items-center border-b">
                <span className="text-xs font-bold text-slate-700">{t.paymentProof}</span>
                <button onClick={() => setViewProofModal(null)} className="p-1 rounded-full hover:bg-slate-100 text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3 max-h-[75vh] overflow-auto flex items-center justify-center bg-slate-950">
                <img src={viewProofModal} alt="Payment Proof" className="max-w-full h-auto object-contain rounded-lg" />
              </div>
            </div>
          </div>
        )}

        {/* --- কাস্টম টোস্ট নোটিফিকেশন --- */}
        {toast && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[110] bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
            {toast.type === 'error' ? (
              <div className="w-2 h-2 rounded-full bg-rose-500" />
            ) : (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

      </div>
    </div>
  );
}

export type Language = 'en' | 'fr';

export const translations = {
  en: {
    // General
    addTransaction: "Add Transaction",

    // Sidebar
    navDashboard: "Dashboard",
    navTransactions: "Transactions",
    navSettings: "Settings",

    // Dashboard
    totalBalance: "Total Balance",
    monthlyIncome: "Monthly Income",
    monthlyExpenses: "Monthly Expenses",
    expensesByCategory: "Expenses by Category",
    spendingBreakdown: "Spending breakdown",
    noTransactions: "No transactions found",
    welcomeMessage: "Welcome back! Here's your financial overview.",

    // Transactions Page
    historyTitle: "Transactions History",
    historySubtitle: "Track, filter, and manage your financial activity.",
    refineResults: "Refine Results",
    searchPlaceholder: "Search by title...",
    pickDate: "Pick a date",
    noTransactionsYet: "No transactions yet. Start by adding one!",
    otherCategory: "Other",

    // Table Headers
    colDate: "Date",
    colTitle: "Title",
    colCategory: "Category",
    colType: "Type",
    colAmount: "Amount",
    colActions: "Actions",

    // Settings Page
    preferencesTitle: "Preferences",
    languageLabel: "Language",
    privacyLabel: "Privacy Mode",
    privacyDesc: "Hide account balances and transaction amounts.",
    dataManagementTitle: "Data Management",
    exportButton: "Export to CSV",
    deleteButton: "Delete All Data",
    settingsSubtitle: "Manage your account and preferences.",
    exportTitle: "Export Data",
    exportDescription: "Download all your transaction data as a CSV file.",
    deleteTitle: "Delete All Data",
    deleteDescription: "Permanently delete all your transactions. This action cannot be undone.",

    // Add Transaction Modal
    modalTitle: "Add Transaction",
    modalDesc: "Create a new income or expense transaction",
    labelTitle: "Title",
    placeholderTitle: "Transaction name",
    labelAmount: "Amount",
    labelType: "Type",
    labelCategory: "Category",
    labelDate: "Date",
    btnCancel: "Cancel",
    btnAdd: "Add",
    typeExpense: "Expense",
    typeIncome: "Income",
    addingText: "Adding...",
    actionEdit: "Edit",
    actionDelete: "Delete",
    deleteDialogTitle: "Delete Transaction?",
    deleteDialogDesc: "Are you sure you want to delete this transaction? This action cannot be undone.",
    deleteDialogTitleLabel: "Title:",
    deleteDialogAmountLabel: "Amount:",
    deleteDialogCancel: "Cancel",
    deleteDialogDeleting: "Deleting...",
    deleteDialogConfirm: "Delete",
  },
  fr: {
    // General
    addTransaction: "Ajouter Transaction",

    // Sidebar
    navDashboard: "Tableau de Bord",
    navTransactions: "Transactions",
    navSettings: "Paramètres",

    // Dashboard
    totalBalance: "Solde Total",
    monthlyIncome: "Revenus Mensuels",
    monthlyExpenses: "Dépenses Mensuelles",
    expensesByCategory: "Dépenses par Catégorie",
    spendingBreakdown: "Répartition des Dépenses",
    noTransactions: "Aucune transaction trouvée",
    welcomeMessage: "Bon retour ! Voici votre aperçu financier.",

    // Transactions Page
    historyTitle: "Historique des Transactions",
    historySubtitle: "Suivez, filtrez et gérez votre activité financière.",
    refineResults: "Filtrer les Résultats",
    searchPlaceholder: "Rechercher par titre...",
    pickDate: "Choisir une date",
    noTransactionsYet: "Aucune transaction pour le moment. Commencez par en ajouter une !",
    otherCategory: "Autre",

    // Table Headers
    colDate: "Date",
    colTitle: "Titre",
    colCategory: "Catégorie",
    colType: "Type",
    colAmount: "Montant",
    colActions: "Actions",

    // Settings Page
    preferencesTitle: "Préférences",
    languageLabel: "Langue",
    privacyLabel: "Mode Discret",
    privacyDesc: "Masquer les soldes et les montants des transactions.",
    dataManagementTitle: "Gestion des Données",
    exportButton: "Exporter en CSV",
    deleteButton: "Supprimer Toutes les Données",
    settingsSubtitle: "Gérez votre compte et vos préférences.",
    exportTitle: "Exporter les données",
    exportDescription: "Téléchargez toutes vos transactions au format CSV.",
    deleteTitle: "Supprimer toutes les données",
    deleteDescription: "Supprimez définitivement toutes vos transactions. Cette action est irréversible.",

    // Add Transaction Modal
    modalTitle: "Ajouter une Transaction",
    modalDesc: "Créer une nouvelle transaction de revenu ou de dépense",
    labelTitle: "Titre",
    placeholderTitle: "Nom de la transaction",
    labelAmount: "Montant",
    labelType: "Type",
    labelCategory: "Catégorie",
    labelDate: "Date",
    btnCancel: "Annuler",
    btnAdd: "Ajouter",
    typeExpense: "Dépense",
    typeIncome: "Revenu",
    addingText: "Ajout en cours...",
    actionEdit: "Modifier",
    actionDelete: "Supprimer",
    deleteDialogTitle: "Supprimer la Transaction ?",
    deleteDialogDesc: "Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible.",
    deleteDialogTitleLabel: "Titre :",
    deleteDialogAmountLabel: "Montant :",
    deleteDialogCancel: "Annuler",
    deleteDialogDeleting: "Suppression...",
    deleteDialogConfirm: "Supprimer",
  },
};

export function getTranslation(language: Language) {
  return translations[language];
}
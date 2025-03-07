export const de = {
  common: {
    add: 'Hinzufügen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    cancel: 'Abbrechen',
    save: 'Speichern',
    create: 'Erstellen',
    update: 'Aktualisieren',
    loading: 'Lädt...',
    error: 'Ein Fehler ist aufgetreten',
    confirm: 'Bestätigen',
    warning: 'Warnung',
    required: 'Erforderlich',
    optional: 'Optional',
    actions: 'Aktionen'
  },
  navigation: {
    documents: 'Dokumente',
    documentTypes: 'Dokumententypen',
    textBlocks: 'Textbausteine',
    clients: 'Bauherren',
    contactPersons: 'Ansprechpartner',
    projects: 'Projekte',
    assets: 'Bauwerke'
  },
  documents: {
    title: 'Dokumente',
    description: 'Verwalten Sie Ihre Baudokumente',
    addDocument: 'Dokument hinzufügen',
    noDocuments: 'Noch keine Dokumente',
    startMessage: 'Erstellen Sie Ihr erstes Dokument'
  },
  projects: {
    title: 'Projekte',
    description: 'Verwalten Sie Bauprojekte',
    addProject: 'Projekt hinzufügen',
    editProject: 'Projekt bearbeiten',
    noProjects: 'Noch keine Projekte',
    startMessage: 'Erstellen Sie Ihr erstes Projekt',
    fields: {
      code: 'Code',
      name: 'Projektname',
      client: 'Kunde',
      status: 'Status',
      startDate: 'Startdatum',
      endDate: 'Enddatum',
      description: 'Beschreibung'
    },
    status: {
      planned: 'Geplant',
      active: 'Aktiv',
      completed: 'Abgeschlossen',
      cancelled: 'Abgebrochen'
    },
    deleteConfirm: 'Sind Sie sicher, dass Sie das Projekt "{{name}}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.'
  },
  clients: {
    title: 'Bauherren',
    singular: 'Bauherr',
    description: 'Verwalten Sie Baukunden und Kontakte',
    addClient: 'Bauherr hinzufügen',
    editClient: 'Bauherr bearbeiten',
    noClients: 'Noch keine Bauherr',
    startMessage: 'Fügen Sie Ihren ersten Bauherrn hinzu',
    fields: {
      name: 'Name',
      email: 'E-Mail',
      phone: 'Telefon',
      businessUnit: 'Geschäftsbereich',
      street1: 'Straße 1',
      street2: 'Straße 2',
      zipcode: 'PLZ',
      city: 'Stadt'
    },
    deleteConfirm: 'Sind Sie sicher, dass Sie den Bauherrn "{{name}}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.'
  },
  documentTypes: {
    title: 'Dokumententypen',
    description: 'Verwalten Sie Dokumentvorlagen und -typen'
  },
  textBlocks: {
    title: 'Textbausteine',
    description: 'Verwalten Sie wiederverwendbare Textbausteine für Dokumente'
  },
  assets: {
    title: 'Bauwerke',
    description: 'Verwalten Sie die Bauwerke zu den Projekten'
  }
};
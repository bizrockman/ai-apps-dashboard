export const en = {
  common: {
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    save: 'Save',
    create: 'Create',
    update: 'Update',
    loading: 'Loading...',
    error: 'An error occurred',
    confirm: 'Confirm',
    warning: 'Warning',
    required: 'Required',
    optional: 'Optional',
    actions: 'Actions'
  },
  navigation: {
    documents: 'Documents',
    documentTypes: 'Document Types',
    textBlocks: 'Text Blocks',
    clients: 'Clients',
    projects: 'Projects',
    assets: 'Construction Elements'
  },
  documents: {
    title: 'Documents',
    description: 'Manage your construction documents',
    addDocument: 'Add Document',
    noDocuments: 'No documents yet',
    startMessage: 'Get started by creating your first document'
  },
  projects: {
    title: 'Projects',
    description: 'Manage construction projects',
    addProject: 'Add Project',
    editProject: 'Edit Project',
    noProjects: 'No projects yet',
    startMessage: 'Get started by creating your first project',
    fields: {
      code: 'Code',
      name: 'Project Name',
      client: 'Client',
      status: 'Status',
      startDate: 'Start Date',
      endDate: 'End Date',
      description: 'Description'
    },
    status: {
      planned: 'Planned',
      active: 'Active',
      completed: 'Completed',
      cancelled: 'Cancelled'
    },
    deleteConfirm: 'Are you sure you want to delete the project "{{name}}"? This action cannot be undone.'
  },
  clients: {
    title: 'Clients',
    description: 'Manage construction clients and contacts',
    addClient: 'Add Client',
    editClient: 'Edit Client',
    noClients: 'No clients yet',
    startMessage: 'Get started by adding your first client',
    fields: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address'
    },
    deleteConfirm: 'Are you sure you want to delete the client "{{name}}"? This action cannot be undone.'
  },
  documentTypes: {
    title: 'Document Types',
    description: 'Manage document templates and types'
  },
  textBlocks: {
    title: 'Text Blocks',
    description: 'Manage reusable text blocks for documents'
  },
  assets: {
    title: 'Construction Elements',
    description: 'Manage construction elements and trades'
  }
};
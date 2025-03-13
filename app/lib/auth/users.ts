/**
 * Benutzerrollen für die Anwendung
 */
export type UserRole = 'consulting' | 'ecommerce' | 'chamber' | 'master' | 'association' | 'logistics' | 'construction';

/**
 * Zuordnung von Anmeldedaten zu Benutzerrollen
 */
export const ROLE_CREDENTIALS: Record<string, UserRole> = {
  'consulting/consulting123': 'consulting',
  'ecommerce/ecommerce123': 'ecommerce',
  'chamber/chamber123': 'chamber',
  'master/master123': 'master',
  'association/association123': 'association',
  'logistics/logistics123': 'logistics',
  'construction/construction123': 'construction',
  'sepmann/Becker!$2025': 'construction'
};

/**
 * Benutzernamen für verschiedene Rollen
 */
export const USER_NAMES = {
  consulting: { firstname: 'Sarah', lastname: 'Schmidt' },
  ecommerce: { firstname: 'Michael', lastname: 'Weber' },
  chamber: { firstname: 'Thomas', lastname: 'Müller' },
  master: { firstname: 'Anna', lastname: 'Becker' },
  association: { firstname: 'Klaus', lastname: 'Wagner' },
  logistics: { firstname: 'Julia', lastname: 'Fischer' },
  construction: { firstname: 'Sabrina', lastname: 'Epmann' }
};

/**
 * Hilfsfunktion zum Überprüfen der Anmeldedaten
 * @param username Benutzername
 * @param password Passwort
 * @returns Die Benutzerrolle oder null, wenn die Anmeldedaten ungültig sind
 */
export function checkCredentials(username: string, password: string): UserRole | null {
  const credentials = `${username}/${password}`;
  const role = ROLE_CREDENTIALS[credentials];
  
  if (role) {
    return role;
  }
  
  // Demo-Login-Fallback
  if (username === 'demo' && password === 'demo123') {
    return 'master';
  }
  
  return null;
}

/**
 * Erstellt ein Benutzerobjekt basierend auf Benutzername und Rolle
 * @param username Benutzername
 * @param role Benutzerrolle
 * @returns Das Benutzerobjekt
 */
export function createUserFromCredentials(username: string, role: UserRole) {
  const { firstname, lastname } = USER_NAMES[role];
  
  return {
    id: `demo-${role}`,
    username,
    email: `${username}@example.com`,
    displayName: `${firstname} ${lastname}`,
    firstname,
    lastname,
    role
  };
} 
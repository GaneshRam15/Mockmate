import { JobRole } from "@/types";
import { jobRoles } from "./interviewUtils";
import { collection, doc, setDoc, getDocs, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ROLES_COLLECTION = 'roles';

export interface RoleManagement {
  openRoles: string[]; // Array of role IDs that are currently open
}

// ============= FIRESTORE-BACKED ROLE MANAGEMENT =============

/**
 * Toggle role open/closed status in Firestore (persists across all users/devices)
 */
export const toggleRoleStatusInDB = async (roleId: string, currentlyOpen: boolean): Promise<void> => {
  try {
    const roleRef = doc(db, ROLES_COLLECTION, roleId);
    await setDoc(roleRef, {
      roleId,
      isOpen: !currentlyOpen,
      updatedAt: Timestamp.now(),
    }, { merge: true });
    console.log(`✅ Role ${roleId} ${!currentlyOpen ? 'opened' : 'closed'} in Firestore`);
  } catch (error) {
    console.error('Failed to toggle role status in Firestore:', error);
    throw error;
  }
};

/**
 * Fetch all roles with their open/closed status from Firestore.
 * Roles not yet in Firestore default to open.
 */
export const getAllRolesWithStatusFromDB = async (): Promise<Array<JobRole & { isOpen: boolean }>> => {
  try {
    const rolesRef = collection(db, ROLES_COLLECTION);
    const snapshot = await getDocs(rolesRef);
    
    const firestoreRoles: Record<string, boolean> = {};
    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      if (data.roleId) {
        firestoreRoles[data.roleId] = data.isOpen !== false; // default true
      }
    });

    return jobRoles.map(role => ({
      ...role,
      isOpen: firestoreRoles[role.id] !== undefined ? firestoreRoles[role.id] : true,
    }));
  } catch (error) {
    console.error('Failed to get roles from Firestore:', error);
    // Fallback: all roles open
    return jobRoles.map(role => ({ ...role, isOpen: true }));
  }
};

/**
 * Fetch only open roles from Firestore (for end-user RoleSelector).
 */
export const getOpenRolesFromDB = async (): Promise<JobRole[]> => {
  const allRoles = await getAllRolesWithStatusFromDB();
  return allRoles.filter(role => role.isOpen);
};

/**
 * Check if a specific role is open in Firestore.
 */
export const isRoleOpenInDB = async (roleId: string): Promise<boolean> => {
  const allRoles = await getAllRolesWithStatusFromDB();
  const role = allRoles.find(r => r.id === roleId);
  return role ? role.isOpen : true; // default open
};

/**
 * Subscribe to real-time role status changes from Firestore.
 * Calls the callback whenever any role status changes.
 * Returns an unsubscribe function.
 */
export const subscribeToRoleChanges = (
  callback: (roles: Array<JobRole & { isOpen: boolean }>) => void
): (() => void) => {
  const rolesRef = collection(db, ROLES_COLLECTION);
  
  const unsubscribe = onSnapshot(rolesRef, (snapshot) => {
    const firestoreRoles: Record<string, boolean> = {};
    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      if (data.roleId) {
        firestoreRoles[data.roleId] = data.isOpen !== false;
      }
    });

    const rolesWithStatus = jobRoles.map(role => ({
      ...role,
      isOpen: firestoreRoles[role.id] !== undefined ? firestoreRoles[role.id] : true,
    }));

    callback(rolesWithStatus);
  }, (error) => {
    console.error('Error listening to role changes:', error);
    // Fallback: all roles open
    callback(jobRoles.map(role => ({ ...role, isOpen: true })));
  });

  return unsubscribe;
};

// ============= LEGACY EXPORTS (kept for backward compatibility) =============
// These are synchronous wrappers that won't be accurate across devices.
// Prefer the async/DB versions above in new code.

const ROLE_MANAGEMENT_KEY = 'mockmate-role-management';

const getRoleManagementFromStorage = (): RoleManagement => {
  try {
    const stored = localStorage.getItem(ROLE_MANAGEMENT_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return { openRoles: jobRoles.map(role => role.id) };
  } catch {
    return { openRoles: jobRoles.map(role => role.id) };
  }
};

export const getOpenRoles = (): JobRole[] => {
  const management = getRoleManagementFromStorage();
  return jobRoles.filter(role => management.openRoles.includes(role.id));
};

export const isRoleOpen = (roleId: string): boolean => {
  const management = getRoleManagementFromStorage();
  return management.openRoles.includes(roleId);
};

export const getAllRolesWithStatus = (): Array<JobRole & { isOpen: boolean }> => {
  const management = getRoleManagementFromStorage();
  return jobRoles.map(role => ({
    ...role,
    isOpen: management.openRoles.includes(role.id)
  }));
};

export const toggleRoleStatus = (roleId: string): RoleManagement => {
  const management = getRoleManagementFromStorage();
  const isOpen = management.openRoles.includes(roleId);
  if (isOpen) {
    management.openRoles = management.openRoles.filter(id => id !== roleId);
  } else {
    management.openRoles.push(roleId);
  }
  try { localStorage.setItem(ROLE_MANAGEMENT_KEY, JSON.stringify(management)); } catch {}
  return management;
};
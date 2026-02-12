import { JobRole } from "@/types";
import { jobRoles } from "./interviewUtils";

const ROLE_MANAGEMENT_KEY = 'mockmate-role-management';

export interface RoleManagement {
  openRoles: string[]; // Array of role IDs that are currently open
}

// Get role management settings from localStorage
export const getRoleManagementFromStorage = (): RoleManagement => {
  try {
    const stored = localStorage.getItem(ROLE_MANAGEMENT_KEY);
    if (stored) {
      return JSON.parse(stored);
    } else {
      // Default: all roles are open initially
      const defaultManagement = { openRoles: jobRoles.map(role => role.id) };
      saveRoleManagementToStorage(defaultManagement);
      return defaultManagement;
    }
  } catch (error) {
    console.error('Failed to parse role management settings:', error);
    // Fallback: all roles open
    return { openRoles: jobRoles.map(role => role.id) };
  }
};

// Save role management settings to localStorage
export const saveRoleManagementToStorage = (management: RoleManagement): void => {
  try {
    localStorage.setItem(ROLE_MANAGEMENT_KEY, JSON.stringify(management));
  } catch (error) {
    console.error('Failed to save role management settings:', error);
  }
};

// Toggle role open/closed status
export const toggleRoleStatus = (roleId: string): RoleManagement => {
  const management = getRoleManagementFromStorage();
  const isOpen = management.openRoles.includes(roleId);
  
  if (isOpen) {
    management.openRoles = management.openRoles.filter(id => id !== roleId);
  } else {
    management.openRoles.push(roleId);
  }
  
  saveRoleManagementToStorage(management);
  return management;
};

// Get all open roles
export const getOpenRoles = (): JobRole[] => {
  const management = getRoleManagementFromStorage();
  return jobRoles.filter(role => management.openRoles.includes(role.id));
};

// Check if a role is open
export const isRoleOpen = (roleId: string): boolean => {
  const management = getRoleManagementFromStorage();
  return management.openRoles.includes(roleId);
};

// Get all roles with their open/closed status
export const getAllRolesWithStatus = (): Array<JobRole & { isOpen: boolean }> => {
  const management = getRoleManagementFromStorage();
  return jobRoles.map(role => ({
    ...role,
    isOpen: management.openRoles.includes(role.id)
  }));
};
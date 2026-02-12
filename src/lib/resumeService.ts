import { db } from './firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ParsedResume } from '@/utils/resumeParser';

const COLLECTIONS = {
  RESUMES: 'resumes',
} as const;

/**
 * Save parsed resume to Firestore
 */
export const saveResumeToFirestore = async (
  userId: string, 
  resume: ParsedResume
): Promise<{ success: boolean; resumeId: string }> => {
  try {
    const resumeId = `resume_${userId}_${Date.now()}`;
    const resumeRef = doc(db, COLLECTIONS.RESUMES, resumeId);
    
    await setDoc(resumeRef, {
      ...resume,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return { success: true, resumeId };
  } catch (error) {
    console.error('Error saving resume:', error);
    return { success: false, resumeId: '' };
  }
};

/**
 * Get resume from Firestore
 */
export const getResumeFromFirestore = async (
  resumeId: string
): Promise<ParsedResume | null> => {
  try {
    const resumeRef = doc(db, COLLECTIONS.RESUMES, resumeId);
    const resumeDoc = await getDoc(resumeRef);
    
    if (!resumeDoc.exists()) {
      return null;
    }
    
    return resumeDoc.data() as ParsedResume;
  } catch (error) {
    console.error('Error getting resume:', error);
    return null;
  }
};

/**
 * Get user's resumes from Firestore
 */
export const getUserResumes = async (userId: string): Promise<ParsedResume[]> => {
  try {
    const resumesRef = collection(db, COLLECTIONS.RESUMES);
    const q = query(resumesRef, where('userId', '==', userId));
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as ParsedResume);
  } catch (error) {
    console.error('Error getting user resumes:', error);
    return [];
  }
};

/**
 * Process resume for interview
 * This replaces the Firebase Storage upload
 */
export const processResumeForInterview = async (
  file: File,
  userId: string
): Promise<{ success: boolean; resume?: ParsedResume; error?: string }> => {
  try {
    // Import dynamically to avoid circular dependencies
    const { parseResumeFile, calculateATSScore } = await import('@/utils/resumeParser');
    
    // Parse the file
    const parsedResume = await parseResumeFile(file);
    
    // Calculate ATS score (default role for now)
    const atsScore = calculateATSScore(parsedResume, 'general');
    
    // Save to Firestore
    const { success, resumeId } = await saveResumeToFirestore(userId, {
      ...parsedResume,
    });
    
    if (!success) {
      return { 
        success: false, 
        error: 'Failed to save resume to database' 
      };
    }
    
    return { 
      success: true, 
      resume: parsedResume 
    };
  } catch (error) {
    console.error('Error processing resume:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to process resume' 
    };
  }
};

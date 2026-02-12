import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';
import { InterviewSession } from '@/types';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  INTERVIEWS: 'interviews',
  ROLES: 'roles',
  SETTINGS: 'settings',
  PRACTICE_APTITUDE: 'practice_aptitude',
  PRACTICE_INTERVIEWS: 'practice_interviews',
  PRACTICE_CODING: 'practice_coding',
  ROUND1_APTITUDE: 'round1_aptitude', // Formal Round 1 results
} as const;

// ============= INTERVIEW OPERATIONS =============

export const saveInterview = async (interview: InterviewSession, userId: string) => {
  try {
    const interviewRef = doc(db, COLLECTIONS.INTERVIEWS, interview.id);
    
    // Convert dates to Firestore timestamps
    const interviewData = {
      ...interview,
      startTime: Timestamp.fromDate(new Date(interview.startTime)),
      endTime: interview.endTime ? Timestamp.fromDate(new Date(interview.endTime)) : null,
      userId, // Associate with user
      createdAt: Timestamp.now(),
    };
    
    await setDoc(interviewRef, interviewData, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error saving interview:', error);
    return { success: false, error };
  }
};

export const getInterview = async (interviewId: string): Promise<InterviewSession | null> => {
  try {
    const interviewRef = doc(db, COLLECTIONS.INTERVIEWS, interviewId);
    const interviewDoc = await getDoc(interviewRef);
    
    if (!interviewDoc.exists()) {
      return null;
    }
    
    const data = interviewDoc.data();
    
    // Convert Firestore timestamps back to Date strings
    return {
      ...data,
      id: interviewDoc.id,
      startTime: data.startTime?.toDate ? data.startTime.toDate().toISOString() : data.startTime,
      endTime: data.endTime?.toDate ? data.endTime.toDate().toISOString() : data.endTime,
    } as InterviewSession;
  } catch (error) {
    console.error('Error getting interview:', error);
    return null;
  }
};

export const getUserInterviews = async (userId: string): Promise<InterviewSession[]> => {
  try {
    const interviewsRef = collection(db, COLLECTIONS.INTERVIEWS);
    const q = query(
      interviewsRef,
      where('userId', '==', userId),
      orderBy('startTime', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        startTime: data.startTime?.toDate ? data.startTime.toDate().toISOString() : data.startTime,
        endTime: data.endTime?.toDate ? data.endTime.toDate().toISOString() : data.endTime,
      } as InterviewSession;
    });
  } catch (error) {
    console.error('Error getting user interviews:', error);
    return [];
  }
};

export const getAllInterviews = async (): Promise<InterviewSession[]> => {
  try {
    const interviewsRef = collection(db, COLLECTIONS.INTERVIEWS);
    const q = query(interviewsRef, orderBy('startTime', 'desc'));
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        startTime: data.startTime?.toDate ? data.startTime.toDate().toISOString() : data.startTime,
        endTime: data.endTime?.toDate ? data.endTime.toDate().toISOString() : data.endTime,
      } as InterviewSession;
    });
  } catch (error) {
    console.error('Error getting all interviews:', error);
    return [];
  }
};

export const updateInterview = async (interviewId: string, updates: Partial<InterviewSession>) => {
  try {
    const interviewRef = doc(db, COLLECTIONS.INTERVIEWS, interviewId);
    
    // Convert dates if present
    const updateData: Record<string, unknown> = { ...updates };
    if (updates.endTime) {
      updateData.endTime = Timestamp.fromDate(new Date(updates.endTime));
    }
    
    await updateDoc(interviewRef, updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating interview:', error);
    return { success: false, error };
  }
};

export const deleteInterview = async (interviewId: string) => {
  try {
    const interviewRef = doc(db, COLLECTIONS.INTERVIEWS, interviewId);
    await deleteDoc(interviewRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting interview:', error);
    return { success: false, error };
  }
};

// ============= USER PROFILE OPERATIONS =============

export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, data: Record<string, unknown>) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await setDoc(userRef, {
      ...data,
      updatedAt: Timestamp.now(),
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error };
  }
};

// ============= ROLE MANAGEMENT =============

export const getRoleStatus = async (roleId: string) => {
  try {
    const roleRef = doc(db, COLLECTIONS.ROLES, roleId);
    const roleDoc = await getDoc(roleRef);
    
    if (roleDoc.exists()) {
      return roleDoc.data();
    }
    return { isOpen: true }; // Default to open if not found
  } catch (error) {
    console.error('Error getting role status:', error);
    return { isOpen: true };
  }
};

export const updateRoleStatus = async (roleId: string, isOpen: boolean) => {
  try {
    const roleRef = doc(db, COLLECTIONS.ROLES, roleId);
    await setDoc(roleRef, {
      roleId,
      isOpen,
      updatedAt: Timestamp.now(),
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error updating role status:', error);
    return { success: false, error };
  }
};

export const getAllRoles = async () => {
  try {
    const rolesRef = collection(db, COLLECTIONS.ROLES);
    const querySnapshot = await getDocs(rolesRef);
    
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting all roles:', error);
    return [];
  }
};

// ============= ANALYTICS =============

export const getInterviewStats = async (userId?: string) => {
  try {
    const interviewsRef = collection(db, COLLECTIONS.INTERVIEWS);
    
    let q;
    if (userId) {
      q = query(
        interviewsRef,
        where('userId', '==', userId),
        where('completed', '==', true)
      );
    } else {
      q = query(interviewsRef, where('completed', '==', true));
    }
    
    const querySnapshot = await getDocs(q);
    const interviews = querySnapshot.docs.map(doc => doc.data() as InterviewSession);
    
    // Calculate statistics
    const totalInterviews = interviews.length;
    const averageScore = totalInterviews > 0 
      ? interviews.reduce((sum, interview) => sum + (interview.score || 0), 0) / totalInterviews 
      : 0;
    const totalPassed = interviews.filter(interview => interview.outcome === 'Passed' || interview.outcome === 'passed').length;
    
    return {
      totalInterviews,
      averageScore: Math.round(averageScore),
      totalPassed,
      passRate: totalInterviews > 0 ? Math.round((totalPassed / totalInterviews) * 100) : 0,
    };
  } catch (error) {
    console.error('Error getting interview stats:', error);
    return {
      totalInterviews: 0,
      averageScore: 0,
      totalPassed: 0,
      passRate: 0,
    };
  }
};
// ============= PRACTICE APTITUDE OPERATIONS =============

export interface PracticeAptitudeResult {
  id: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  categoryPerformance: {
    [category: string]: {
      correct: number;
      total: number;
      percentage: number;
    };
  };
  weakTopics: string[];
  recommendations: Array<{
    topic: string;
    videos: Array<{
      title: string;
      channel: string;
      searchQuery: string;
    }>;
  }>;
  completedAt: string;
  createdAt: Timestamp;
}

export const savePracticeAptitudeResult = async (
  result: Omit<PracticeAptitudeResult, 'id' | 'createdAt'>,
  userId: string
) => {
  try {
    console.log('📝 Attempting to save practice aptitude result...');
    console.log('User ID:', userId);
    console.log('Result data:', result);
    
    const practiceRef = doc(collection(db, COLLECTIONS.PRACTICE_APTITUDE));
    console.log('Document reference created:', practiceRef.id);
    
    const practiceData = {
      ...result,
      id: practiceRef.id,
      createdAt: Timestamp.now(),
      completedAt: Timestamp.fromDate(new Date(result.completedAt)),
    };
    
    console.log('Saving to Firestore...');
    await setDoc(practiceRef, practiceData);
    console.log('✅ Successfully saved to Firestore!');
    
    return { success: true, id: practiceRef.id };
  } catch (error: any) {
    console.error('❌ Error saving practice aptitude result:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    return { success: false, error: error?.message || 'Unknown error' };
  }
};

export const getPracticeAptitudeHistory = async (userId: string): Promise<PracticeAptitudeResult[]> => {
  try {
    console.log('🔍 Fetching aptitude history for user:', userId);
    const practiceRef = collection(db, COLLECTIONS.PRACTICE_APTITUDE);
    
    // Try with index first
    try {
      const q = query(
        practiceRef,
        where('userId', '==', userId),
        orderBy('completedAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      console.log('✅ Aptitude history fetched with index:', querySnapshot.docs.length, 'results');
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          completedAt: data.completedAt?.toDate ? data.completedAt.toDate().toISOString() : data.completedAt,
          createdAt: data.createdAt,
        } as PracticeAptitudeResult;
      });
    } catch (indexError: any) {
      // Fallback: fetch all and filter/sort in memory
      if (indexError?.code === 'failed-precondition') {
        console.warn('⚠️ Index not ready yet, using fallback query...');
        const q = query(practiceRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        const results = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            completedAt: data.completedAt?.toDate ? data.completedAt.toDate().toISOString() : data.completedAt,
            createdAt: data.createdAt,
          } as PracticeAptitudeResult;
        });
        
        // Sort in memory
        results.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
        console.log('✅ Aptitude history fetched with fallback:', results.length, 'results');
        return results.slice(0, 50);
      }
      throw indexError;
    }
  } catch (error) {
    console.error('❌ Error getting practice aptitude history:', error);
    return [];
  }
};

// ============= PRACTICE INTERVIEW OPERATIONS =============

export interface PracticeInterviewResult {
  id: string;
  userId: string;
  roleId: string;
  roleName: string;
  questions: Array<{
    question: string;
    answer: string;
    feedback: {
      score: number;
      strengths: string[];
      improvements: string[];
      rating: string;
    };
  }>;
  overallScore: number;
  averageQuestionScore: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  completedAt: string;
  createdAt: Timestamp;
}

export const savePracticeInterviewResult = async (
  result: Omit<PracticeInterviewResult, 'id' | 'createdAt'>,
  userId: string
) => {
  try {
    console.log('📝 Attempting to save practice interview result...');
    console.log('User ID:', userId);
    console.log('Result data:', result);
    
    const practiceRef = doc(collection(db, COLLECTIONS.PRACTICE_INTERVIEWS));
    console.log('Document reference created:', practiceRef.id);
    
    const practiceData = {
      ...result,
      id: practiceRef.id,
      createdAt: Timestamp.now(),
      completedAt: Timestamp.fromDate(new Date(result.completedAt)),
    };
    
    console.log('Saving to Firestore...');
    await setDoc(practiceRef, practiceData);
    console.log('✅ Successfully saved to Firestore!');
    
    return { success: true, id: practiceRef.id };
  } catch (error: any) {
    console.error('❌ Error saving practice interview result:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    return { success: false, error: error?.message || 'Unknown error' };
  }
};

export const getPracticeInterviewHistory = async (userId: string): Promise<PracticeInterviewResult[]> => {
  try {
    console.log('🔍 Fetching interview history for user:', userId);
    const practiceRef = collection(db, COLLECTIONS.PRACTICE_INTERVIEWS);
    
    // Try with index first
    try {
      const q = query(
        practiceRef,
        where('userId', '==', userId),
        orderBy('completedAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      console.log('✅ Interview history fetched with index:', querySnapshot.docs.length, 'results');
      console.log('📊 First result userId check:', querySnapshot.docs[0]?.data().userId);
      
      const results = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          completedAt: data.completedAt?.toDate ? data.completedAt.toDate().toISOString() : data.completedAt,
          createdAt: data.createdAt,
        } as PracticeInterviewResult;
      });
      
      console.log('✅ Filtered interview count for user:', results.length);
      return results;
    } catch (indexError: any) {
      // Fallback: fetch all and filter/sort in memory
      if (indexError?.code === 'failed-precondition') {
        console.warn('⚠️ Index not ready yet, using fallback query...');
        const q = query(practiceRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        const results = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            completedAt: data.completedAt?.toDate ? data.completedAt.toDate().toISOString() : data.completedAt,
            createdAt: data.createdAt,
          } as PracticeInterviewResult;
        });
        
        // Sort in memory
        results.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
        console.log('✅ Interview history fetched with fallback:', results.length, 'results');
        return results.slice(0, 50);
      }
      throw indexError;
    }
  } catch (error) {
    console.error('❌ Error getting practice interview history:', error);
    return [];
  }
};

// ============= BOT INTERVIEW OPERATIONS =============

export interface BotInterviewResult {
  id: string;
  userId: string;
  candidateName: string;
  role: string;
  conversationLog: Array<{
    role: 'steven' | 'candidate';
    message: string;
  }>;
  feedback: {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    detailedFeedback: string;
  };
  completedAt: string;
  createdAt: Timestamp;
}

export const saveBotInterviewResult = async (
  result: Omit<BotInterviewResult, 'id' | 'createdAt'>,
  userId: string
) => {
  try {
    console.log('📝 Attempting to save bot interview result...');
    console.log('User ID:', userId);
    
    const botInterviewRef = doc(collection(db, 'botInterviews'));
    console.log('Document reference created:', botInterviewRef.id);
    
    const interviewData = {
      ...result,
      userId,
      id: botInterviewRef.id,
      createdAt: Timestamp.now(),
    };
    
    console.log('Saving to Firestore...');
    await setDoc(botInterviewRef, interviewData);
    console.log('✅ Successfully saved bot interview to Firestore!');
    
    return { success: true, id: botInterviewRef.id };
  } catch (error: any) {
    console.error('❌ Error saving bot interview result:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    return { success: false, error: error?.message || 'Unknown error' };
  }
};

export const getBotInterviewHistory = async (userId: string): Promise<BotInterviewResult[]> => {
  try {
    console.log('🔍 Fetching bot interview history for user:', userId);
    const botInterviewRef = collection(db, 'botInterviews');
    
    // Try with index first
    try {
      const q = query(
        botInterviewRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      console.log('✅ Bot interview history fetched with index:', querySnapshot.docs.length, 'results');
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          completedAt: data.completedAt || data.createdAt?.toDate()?.toISOString(),
          createdAt: data.createdAt,
        } as BotInterviewResult;
      });
    } catch (indexError: any) {
      // Fallback: fetch all and filter/sort in memory
      if (indexError?.code === 'failed-precondition') {
        console.warn('⚠️ Index not ready yet, using fallback query...');
        const q = query(botInterviewRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        const results = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            completedAt: data.completedAt || data.createdAt?.toDate()?.toISOString(),
            createdAt: data.createdAt,
          } as BotInterviewResult;
        });
        
        // Sort in memory
        results.sort((a, b) => 
          new Date(b.createdAt?.toDate?.() || b.completedAt).getTime() - 
          new Date(a.createdAt?.toDate?.() || a.completedAt).getTime()
        );
        console.log('✅ Bot interview history fetched with fallback:', results.length, 'results');
        return results.slice(0, 50);
      }
      throw indexError;
    }
  } catch (error) {
    console.error('❌ Error getting bot interview history:', error);
    return [];
  }
};

// ============= CODING PRACTICE OPERATIONS =============

export const savePracticeCodingResult = async (session: any, userId: string) => {
  try {
    const sessionRef = doc(db, COLLECTIONS.PRACTICE_CODING || 'practice_coding', session.id);
    
    const sessionData = {
      ...session,
      userId,
      date: Timestamp.fromDate(new Date(session.date)),
      startTime: Timestamp.fromDate(new Date(session.startTime)),
      endTime: session.endTime ? Timestamp.fromDate(new Date(session.endTime)) : null,
      createdAt: Timestamp.now(),
    };
    
    await setDoc(sessionRef, sessionData);
    console.log('✅ Coding practice session saved:', session.id);
    return { success: true, id: session.id };
  } catch (error) {
    console.error('❌ Error saving coding practice session:', error);
    return { success: false, error };
  }
};

export const getPracticeCodingSessions = async (userId: string) => {
  try {
    const sessionsRef = collection(db, COLLECTIONS.PRACTICE_CODING || 'practice_coding');
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        date: data.date?.toDate ? data.date.toDate().toISOString() : data.date,
        startTime: data.startTime?.toDate ? data.startTime.toDate().toISOString() : data.startTime,
        endTime: data.endTime?.toDate ? data.endTime.toDate().toISOString() : data.endTime,
      };
    });
  } catch (error) {
    console.error('❌ Error getting coding practice sessions:', error);
    return [];
  }
};

// ============= ROUND 1 APTITUDE OPERATIONS (FORMAL INTERVIEWS) =============

import { RoundOneAptitudeResult } from '@/types';

export const saveRound1AptitudeResult = async (
  result: Omit<RoundOneAptitudeResult, 'id'>,
  userId: string
) => {
  try {
    console.log('📝 Saving Round 1 aptitude result...');
    console.log('User ID:', userId);
    console.log('Result data:', result);
    
    const aptitudeRef = doc(collection(db, COLLECTIONS.ROUND1_APTITUDE));
    
    const aptitudeData = {
      ...result,
      id: aptitudeRef.id,
      userId: userId, // Explicitly set userId to ensure it's saved correctly
      createdAt: Timestamp.now(),
      completedAt: Timestamp.fromDate(new Date(result.completedAt)),
      selectedForRound2: false, // Default value
      round2EmailSent: false, // Default value
    };
    
    console.log('Saving data to Firestore:', aptitudeData);
    
    await setDoc(aptitudeRef, aptitudeData);
    console.log('✅ Round 1 aptitude result saved successfully with ID:', aptitudeRef.id);
    
    return { success: true, id: aptitudeRef.id };
  } catch (error: any) {
    console.error('❌ Error saving Round 1 aptitude:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    return { success: false, error: error?.message || 'Unknown error' };
  }
};

export const getRound1AptitudeResults = async (userId?: string): Promise<RoundOneAptitudeResult[]> => {
  try {
    console.log('🔍 Fetching Round 1 aptitude results for userId:', userId || 'ALL');
    const aptitudeRef = collection(db, COLLECTIONS.ROUND1_APTITUDE);
    
    let querySnapshot;
    if (userId) {
      // User-specific query - simpler query without orderBy to avoid index requirement
      const q = query(
        aptitudeRef,
        where('userId', '==', userId)
      );
      querySnapshot = await getDocs(q);
      console.log(`✅ Found ${querySnapshot.docs.length} Round 1 results for user`);
    } else {
      // Admin view - get all results with ordering
      const q = query(aptitudeRef, orderBy('completedAt', 'desc'));
      querySnapshot = await getDocs(q);
      console.log(`✅ Found ${querySnapshot.docs.length} total Round 1 results`);
    }
    
    const results = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        completedAt: data.completedAt?.toDate ? data.completedAt.toDate().toISOString() : data.completedAt,
      } as RoundOneAptitudeResult;
    });
    
    // Sort by completedAt on client side for user queries
    if (userId) {
      results.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    }
    
    return results;
  } catch (error) {
    console.error('❌ Error getting Round 1 results:', error);
    console.error('Error details:', error);
    return [];
  }
};

export const updateRound1AptitudeResult = async (
  resultId: string, 
  updates: Partial<RoundOneAptitudeResult>
) => {
  try {
    const aptitudeRef = doc(db, COLLECTIONS.ROUND1_APTITUDE, resultId);
    await updateDoc(aptitudeRef, updates as any);
    console.log('✅ Round 1 result updated');
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating Round 1 result:', error);
    return { success: false, error };
  }
};
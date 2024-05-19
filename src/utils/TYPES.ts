export interface Grade {
  student: string;
  grade: number;
  points: number;
  outOf: number;
  gradedResponses: {
    number: string;
    answer: string;
    correctAnswer: string;
    points: number;
    outOf: number;
    isAdditional: boolean;
  }[];
  additionalPoints: number;
  outOfAdditional: number;
  teacherComment: string;
}

export interface PrivateGrading {
  pointsToGradeStrategy: string;
  grades: Grade[];
  isGradesAccessible: boolean;
  isShowOnlyGrade: boolean;
}

export interface PrivateTestData {
  title: string;
  description: string;
  specialSymbols: string;
  questions: {
    number: string;
    question: string;
    correctAnswer: string;
    points: number;
    isAdditional: boolean;
  }[];
  isTestAccessible: boolean;
}

export interface UserData {
  writerEmail: string;
  tests: {
    [testId: string]: {
      lastModified: string;
      test: PrivateTestData;
      grading: PrivateGrading;
    };
  };
}

export interface Execution {
  [testId: string]: {
    readerEmail: string;
    fullscreenExits: {
      studentId: string;
      timestamp: string;
    }[];
    responses: {
      studentId: string;
      answers: {
        number: string;
        answer: string;
      }[];
      timestamp: string;
    }[];
    feedback: {
      studentId: string;
      feedback: string;
      timestamp: string;
    }[];
  };
}

export interface AccessibleTest {
  title: string;
  writerEmail: string;
  description: string;
  specialSymbols: string;
  questions: {
    number: string;
    question: string;
    points: number;
    isAdditional: boolean;
  }[];
}

export interface AccessibleGrade {
  writerEmail: string;
  grades: Grade[];
}

// interface FirebaseData {
//   users: {
//     [email: string]: UserData;
//   };
//   execution: Execution;
//   accessibleTests: {
//     [testId: string]: AccessibleTest;
//   };
//   accessibleGrades: {
//     [testId: string]: AccessibleGrade;
//   };
//   testCodesInUse: string[];
// }

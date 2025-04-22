export interface WorkoutRoutine {
  name: string;
  sets: number;
  reps: number;
}

export interface WorkoutDay {
  day: string;
  routines: WorkoutRoutine[];
}

export interface WorkoutPlan {
  schedule: string[];
  exercises: WorkoutDay[];
}

export interface RawWorkoutRoutine {
  name: string;
  sets: number | string;
  reps: number | string;
}

export interface RawWorkoutDay {
  day: string;
  routines: RawWorkoutRoutine[];
}

export interface RawWorkoutPlan {
  schedule: string[];
  exercises: RawWorkoutDay[];
}

export interface Meal {
  name: string;
  foods: string[];
}

export interface DietPlan {
  dailyCalories: number;
  meals: Meal[];
}

export interface RawDietPlan {
  dailyCalories: number | string;
  meals: Meal[];
}

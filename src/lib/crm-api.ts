export interface CrmCourse {
  id: string;
  name: string;
  courseType: 'regular' | 'workshop';
  duration: string;
  price: number | null;
}

export async function fetchCrmCourses(
  courseType: 'all' | 'regular' | 'workshop' = 'all'
): Promise<CrmCourse[]> {
  try {
    const res = await fetch(`/api/courses?courseType=${courseType}`);
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data as CrmCourse[]) || [];
  } catch {
    return [];
  }
}

export async function submitLeadToCrm(data: {
  name: string;
  email: string;
  mobile: string;
  courseInterest?: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return { success: json.success, error: json.error };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

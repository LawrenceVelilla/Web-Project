<<<<<<< HEAD
import { NextResponse } from 'next/server';
import { getCourseDetails } from '@/lib/data';

interface Params {
  department: string;
  courseCode: string;
}

export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  const departmentCode = params.department;
  const courseCodeNumber = params.courseCode; 

  if (!departmentCode || !courseCodeNumber) {
    return NextResponse.json({ message: 'Department and Course Code are required' }, { status: 400 });
  }

  try {
    // Call the data fetching function
    const course = await getCourseDetails(departmentCode, courseCodeNumber);

    if (!course) {
      // Data function returned null, meaning not found
      return NextResponse.json({ message: `Course ${departmentCode.toUpperCase()} ${courseCodeNumber} not found` }, { status: 404 });
    }

    return NextResponse.json(course);

  } catch (error) {
    // Catch unexpected errors from the data function or processing
    console.error(`API Error fetching course ${departmentCode} ${courseCodeNumber}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
=======
import { NextRequest, NextResponse } from 'next/server';
import { getCourseDetails } from '@/lib/data';

// Interface defining the expected URL path parameters
interface CourseRouteParams {
  department: string;
  courseCode: string; // Corresponds to the [courseCode] folder name
}

// Define the expected shape of the second argument object using the interface
interface HandlerContext {
    params: CourseRouteParams;
}

/**
 * API Route Handler for GET requests to /api/courses/[department]/[courseCode]
 * Fetches and returns details for a specific course.
 */
export async function GET(
  request: NextRequest,
  // Use the HandlerContext type which includes the params interface
  context: HandlerContext
) {
  // Destructure params from the context
  const { department, courseCode } = context.params;

  // Basic validation
  if (!department || !courseCode) {
    return NextResponse.json(
      { message: 'Department and Course Code parameters are required' },
      { status: 400 }
    );
  }

  try {
    // **** CALL THE CORRECT FUNCTION TO GET A SINGLE COURSE ****
    const course = await getCourseDetails(department, courseCode);

    // Check if the specific course was found
    if (!course) {
      return NextResponse.json(
        { message: `Course ${department.toUpperCase()} ${courseCode} not found` },
        { status: 404 }
      );
    }

    // Return the found course data
    return NextResponse.json(course);

  } catch (error) {
    // Catch any unexpected errors
    console.error(`API Error fetching course ${department} ${courseCode}:`, error);
    return NextResponse.json(
      { message: 'Internal Server Error while fetching course data' },
      { status: 500 }
    );
>>>>>>> 98bf119 (Fixed page props and GET)
  }
}
import StudentCourseDetailPage from '@/components/studentCourseDetailPage'

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  return <StudentCourseDetailPage courseId={params.courseId} />
}

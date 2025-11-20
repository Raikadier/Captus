import TeacherCourseDetailPage from '@/components/teacherCourseDetailPage'

export default function Page({ params }: { params: { id: string } }) {
  return <TeacherCourseDetailPage courseId={params.id} />
}

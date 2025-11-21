import CreateCourseTaskPage from '@/components/createCourseTaskPage'

export default function Page({ params }: { params: { id: string } }) {
  return <CreateCourseTaskPage courseId={params.id} />
}

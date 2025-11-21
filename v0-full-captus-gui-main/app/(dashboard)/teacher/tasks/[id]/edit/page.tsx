import TeacherEditTaskPage from '@/components/teacherEditTaskPage'

export default function Page({ params }: { params: { id: string } }) {
  return <TeacherEditTaskPage taskId={params.id} />
}

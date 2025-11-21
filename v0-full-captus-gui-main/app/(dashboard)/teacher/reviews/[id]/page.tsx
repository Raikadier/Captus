import { TeacherReviewSubmissionPage } from '@/components/teacherReviewSubmissionPage'

export default function Page({ params }: { params: { id: string } }) {
  return <TeacherReviewSubmissionPage submissionId={params.id} />
}

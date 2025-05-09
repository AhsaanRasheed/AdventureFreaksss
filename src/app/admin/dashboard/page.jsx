import AuthGuard from "../auth-guard";
import AdminQuizEditor from "./quiz-editor";

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminQuizEditor />
    </AuthGuard>
  )
}
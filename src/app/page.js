import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/quiz'); // Automatically redirects to /quiz
}
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-white">
      <h1>Interny</h1>
      <p>Interny is a platform for interns to find internships</p>
      <Link href="/login">Login</Link>
    </main>
  );
}

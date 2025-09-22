import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
      <p className="text-muted-foreground mb-6">Placeholder page. Thiết kế UI trong Figma trước, sau đó map vào code.</p>
      <Link href="/" className="text-blue-600 underline">Back to Home</Link>
    </div>
  );
}

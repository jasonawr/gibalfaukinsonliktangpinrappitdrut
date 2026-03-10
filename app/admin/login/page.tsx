import { LoginForm } from "@/components/login-form";

export default function AdminLoginPage() {
  return (
    <div className="section">
      <div className="container narrow">
        <h1>Admin Login</h1>
        <p>Use seeded credentials to access the CMS.</p>
        <LoginForm />
      </div>
    </div>
  );
}

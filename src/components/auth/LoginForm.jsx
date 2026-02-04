// professional login form
import Input from "../common/Input";
import Button from "../common/Button";
import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({}); // state for validation errors

  // handle typing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // clear error when user types
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // basic validation
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    // if errors exist, stop and show them
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    // success
    onLogin({ email: formData.email });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full animate-fadeIn">
      <div className="flex flex-col gap-4">
        <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
        />
        <div className="flex flex-col">
            <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
            />
            <div className="flex justify-end mt-2">
                <a href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                    Forgot Password?
                </a>
            </div>
        </div>
      </div>
      
      <div className="mt-2">
        <Button text="Sign In" type="submit" />
      </div>
    </form>
  );
}

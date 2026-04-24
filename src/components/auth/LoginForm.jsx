import Input from "../common/Input";
import Button from "../common/Button";
import { useState } from "react";

// added isloading and externalerror to handle backend states
export default function LoginForm({ onLogin, isLoading = false, error: externalError = null }) {
  // changed identifier from email to username
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  
  // added state to track active async submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // validated username instead of email
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    // implemented async handling and submission toggle
    setIsSubmitting(true);
    await onLogin(formData.username, formData.password);
    setIsSubmitting(false);
  };

  // priority logic for showing external or local errors
  const displayError = externalError || (Object.keys(errors).length > 0 ? Object.values(errors)[0] : null);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* added visual alert for global error messages */}
      {displayError && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {displayError}
        </div>
      )}
      <div className="flex flex-col gap-4">
        <Input
            label="Username"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            // added disabled state to prevent input during loading
            disabled={isSubmitting || isLoading}
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
                // added disabled state to prevent input during loading
                disabled={isSubmitting || isLoading}
            />
            <div className="flex justify-end mt-2">
                <a href="#" className="text-sm font-medium text-primary hover:text-opacity-80 transition-colors">
                    Forgot Password?
                </a>
            </div>
        </div>
      </div>
      
      <div className="mt-2">
        {/* added dynamic text and loading state to button */}
        <Button 
            text={isSubmitting ? "Signing In..." : "Sign In"} 
            type="submit" 
            fullWidth 
            disabled={isSubmitting || isLoading}
        />
      </div>
    </form>
  );
}
import Input from "../common/Input";
import Button from "../common/Button";
import { useState } from "react";

// added isloading and externalerror to handle backend states
export default function RegisterForm({ onSignup, isLoading = false, error: externalError = null }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
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

    if (!formData.name) newErrors.name = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Must be at least 6 characters";
    
    if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    // implemented async handling and submission toggle
    setIsSubmitting(true);
    // send email as username to backend
    await onSignup(formData.email, formData.password);
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
            label="Full Name"
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            // added disabled state to prevent input during loading
            disabled={isSubmitting || isLoading}
        />
        <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            // added disabled state to prevent input during loading
            disabled={isSubmitting || isLoading}
        />
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
        <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            // added disabled state to prevent input during loading
            disabled={isSubmitting || isLoading}
        />
      </div>
      
      <div className="mt-2">
        {/* added dynamic text and loading state to button */}
        <Button 
            text={isSubmitting ? "Creating Account..." : "Create Account"} 
            type="submit" 
            fullWidth 
            disabled={isSubmitting || isLoading}
        />
      </div>
    </form>
  );
}

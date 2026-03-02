import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { FaUserTie, FaUserGraduate } from "react-icons/fa";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const navigateUser = (currRole) => {
    navigate(currRole === "recruiter" ? "/post-job" : "/jobs");
  };

  const handleRoleSelection = async (role) => {
    await user
      .update({ unsafeMetadata: { role } })
      .then(() => {
        console.log(`Role updated to: ${role}`);
        navigateUser(role);
      })
      .catch((err) => {
        console.error("Error updating role:", err);
      });
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

return (
  <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">

    <h2 className="gradient-title font-extrabold text-5xl sm:text-7xl tracking-tight mb-16">
      I am a...
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">

      <Button
        className="h-28 text-xl bg-blue-600 hover:bg-blue-700 transition-all duration-300"
        onClick={() => handleRoleSelection("candidate")}
      >
        Candidate
      </Button>

      <Button
        className="h-28 text-xl bg-red-600 hover:bg-red-700 transition-all duration-300"
        onClick={() => handleRoleSelection("recruiter")}
      >
        Recruiter
      </Button>

    </div>
  </div>
);
}


export default Onboarding;
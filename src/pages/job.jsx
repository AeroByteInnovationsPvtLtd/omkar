import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Briefcase,
  DoorClosed,
  DoorOpen,
  MapPinIcon,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    { job_id: id }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  if (!isLoaded || loadingJob) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BarLoader width={"50%"} color="#36d7b7" />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 pb-20 mt-8 flex flex-col gap-10">

      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

        <div>
          <h1 className="gradient-title text-4xl sm:text-5xl font-bold mb-4">
            {job?.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <MapPinIcon size={16} />
              {job?.location}
            </div>

            <div className="flex items-center gap-2">
              <Briefcase size={16} />
              {job?.applications?.length} Applicants
            </div>

            <div className="flex items-center gap-2">
              {job?.isOpen ? (
                <>
                  <DoorOpen size={16} className="text-green-400" />
                  <span className="text-green-400">Open</span>
                </>
              ) : (
                <>
                  <DoorClosed size={16} className="text-red-400" />
                  <span className="text-red-400">Closed</span>
                </>
              )}
            </div>
          </div>
        </div>

        {job?.company?.logo_url && (
          <img
            src={job.company.logo_url}
            className="h-16 object-contain"
            alt={job.title}
          />
        )}
      </div>

      {/* ================= RECRUITER STATUS SELECT ================= */}
      {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full max-w-xs ${
              job?.isOpen ? "bg-green-950" : "bg-red-950"
            }`}
          >
            <SelectValue
              placeholder={`Hiring Status ${
                job?.isOpen ? "( Open )" : "( Closed )"
              }`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* ================= ABOUT SECTION ================= */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">About the Job</h2>

        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          {job?.description
            ?.split("-")
            .filter(Boolean)
            .map((point, index) => (
              <li key={index}>{point.trim()}</li>
            ))}
        </ul>
      </div>

      {/* ================= REQUIREMENTS SECTION ================= */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          What We Are Looking For
        </h2>

        <MDEditor.Markdown
          source={job?.requirements}
          className="bg-transparent text-gray-300"
        />
      </div>

      {/* ================= APPLY SECTION ================= */}
      {job?.recruiter_id !== user?.id && (
        <div className="mt-4">
          <ApplyJobDrawer
            job={job}
            user={user}
            fetchJob={fnJob}
            applied={job?.applications?.find(
              (ap) => ap.candidate_id === user.id
            )}
          />
        </div>
      )}

      {loadingHiringStatus && (
        <BarLoader width={"100%"} color="#36d7b7" />
      )}

      {/* ================= APPLICATIONS SECTION ================= */}
      {job?.applications?.length > 0 &&
        job?.recruiter_id === user?.id && (
          <div className="mt-6">
            <h2 className="font-semibold text-xl mb-6">
              Applications
            </h2>

            <div className="flex flex-col gap-4">
              {job?.applications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                />
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default JobPage;
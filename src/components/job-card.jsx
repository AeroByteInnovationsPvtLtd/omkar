/* eslint-disable react/prop-types */
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteJob, saveJob } from "@/api/apiJobs";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob);

  const handleSaveJob = async () => {
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobAction();
  };

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };

  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  return (
    // 🔥 Your upgraded JSX goes here
    <Card className="flex flex-col bg-white/5 backdrop-blur border border-gray-700 hover:scale-[1.02] transition-all duration-300 shadow-lg">
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      <CardHeader>
        <CardTitle className="flex justify-between items-start font-semibold text-lg">
          <span className="line-clamp-1">{job.title}</span>

          {isMyJob && (
            <Trash2Icon
              size={18}
              className="text-red-400 cursor-pointer hover:text-red-600 transition"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1 text-gray-300 text-sm">
        <div className="flex justify-between items-center">
          {job.company && (
            <img src={job.company.logo_url} className="h-6 object-contain" />
          )}
          <div className="flex gap-2 items-center text-gray-400">
            <MapPinIcon size={15} />
            {job.location}
          </div>
        </div>

        <div className="border-t border-gray-700 pt-3 line-clamp-2">
          {job.description.substring(0, job.description.indexOf("."))}.
        </div>
      </CardContent>

      <CardFooter className="flex gap-3">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-300">
            More Details
          </Button>
        </Link>

        {!isMyJob && (
          <Button
            variant="outline"
            className="w-12 border-gray-600 hover:bg-red-500/20 transition"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={20} fill="red" stroke="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
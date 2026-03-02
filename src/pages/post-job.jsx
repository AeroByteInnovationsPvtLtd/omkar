import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  }, [loadingCreateJob]);

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >
        <Label htmlFor="title">Job Title</Label>
        <Input id="title" placeholder="Enter job title" {...register("title")} />
        {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}

        <Label htmlFor="description">Job Description</Label>
        <Textarea id="description" placeholder="Describe the job role" {...register("description")} />
        {errors.description && (
          <p className="text-red-500 text-xs">{errors.description.message}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <Label htmlFor="location">Job Location</Label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="location" className="bg-white text-black border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent side="bottom" className="bg-white text-black border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
                    <SelectGroup>
                      {State.getStatesOfCountry("IN").map(({ name }) => (
                        <SelectItem key={name} value={name} className="hover:bg-blue-100 focus:bg-blue-200 text-black">
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.location && (
              <p className="text-red-500 text-xs">{errors.location.message}</p>
            )}
          </div>
          <div className="flex-1 w-full">
            <Label htmlFor="company_id">Company</Label>
            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <Select value={String(field.value)} onValueChange={val => field.onChange(String(val))}>
                  <SelectTrigger id="company_id" className="bg-white text-black border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent side="bottom" className="bg-white text-black border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
                    <SelectGroup>
                      {companies?.map(({ name, id }) => (
                        <SelectItem key={id} value={String(id)} className="hover:bg-blue-100 focus:bg-blue-200 text-black">
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.company_id && (
              <p className="text-red-500 text-xs">{errors.company_id.message}</p>
            )}
          </div>
          <div className="flex-none w-full sm:w-auto mt-2 sm:mt-6">
            <AddCompanyDrawer fetchCompanies={fnCompanies} />
          </div>
        </div>

        <Label htmlFor="requirements">Requirements</Label>
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor
              id="requirements"
              value={field.value}
              onChange={val => field.onChange(val ?? "")}
            />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500 text-xs">{errors.requirements.message}</p>
        )}
        {errors.errorCreateJob && (
          <p className="text-red-500 text-xs">{errors?.errorCreateJob?.message}</p>
        )}
        {errorCreateJob?.message && (
          <p className="text-red-500 text-xs">{errorCreateJob?.message}</p>
        )}
        {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}
        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
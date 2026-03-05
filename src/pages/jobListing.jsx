import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";

import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { isLoaded } = useUser();

  const {
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  /* =============================
     FETCH COMPANIES
  ============================= */
  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  /* =============================
     FETCH JOBS
  ============================= */
  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  /* =============================
     SEARCH HANDLER
  ============================= */
  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    setSearchQuery(query || "");
  };

  /* =============================
     CLEAR FILTERS
  ============================= */
  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  };

  /* =============================
     LOADING STATE
  ============================= */
  if (!isLoaded) {
    return <BarLoader width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="min-h-screen px-6 pb-20 max-w-7xl mx-auto">

      {/* =============================
         PAGE TITLE
      ============================= */}
      <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl text-center mb-10">
        Latest Jobs
      </h1>

      {/* =============================
         SEARCH BAR
      ============================= */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-4 items-center mb-6"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title..."
          name="search-query"
          className="h-14 flex-1 px-4 text-md"
        />
        <Button type="submit" className="h-14 sm:w-32" variant="blue">
          Search
        </Button>
      </form>

      {/* =============================
         FILTER SECTION
      ============================= */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-8">

        {/* LOCATION FILTER */}
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="bg-white text-black border-gray-300">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* COMPANY FILTER */}
        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger className="bg-white text-black border-gray-300">
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name, id }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* CLEAR FILTER BUTTON */}
        <Button
          variant="destructive"
          onClick={clearFilters}
          className="md:w-40 hover:bg-red-600 transition-colors"
        >
          Clear Filters
        </Button>
      </div>

      {/* =============================
         LOADING JOBS
      ============================= */}
      {loadingJobs && (
        <BarLoader width={"100%"} color="#36d7b7" />
      )}

      {/* =============================
         JOB GRID
      ============================= */}
      {!loadingJobs && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {jobs?.length ? (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savedInit={job?.saved?.length > 0}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 text-lg py-20">
              No jobs found 😢
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default JobListing;
import supabaseClient, { supabaseUrl } from "@/utils/supabase";
import localCompanies from "@/data/companies.json";

// Fetch Companies
export async function getCompanies(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("Error fetching Companies:", error);
    // Fallback to local data for development when Supabase table is missing
    return localCompanies;
  }

  return data;
}

// Add Company
export async function addNewCompany(token, _, companyData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  // preserve original filename (keeps extension) to ensure correct content-type
  const originalName = companyData.logo?.name || companyData.name;
  const safeName = `${random}-${originalName}`.replace(/\s+/g, "_");
  const fileName = `logo-${safeName}`;
  // Try uploading logo to storage; if storage or table is missing, fall back gracefully
  // Use existing public app logo as a safe default
  let logo_url = "/logo.png";

  try {
    const { error: storageError } = await supabase.storage
      .from("company-logo")
      .upload(fileName, companyData.logo);

    if (storageError) {
      console.warn("Storage upload failed, using default logo:", storageError);
    } else {
      logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;
    }
  } catch (e) {
    console.warn("Unexpected storage error, using default logo:", e);
  }

  try {
    const { data, error } = await supabase
      .from("companies")
      .insert([
        {
          name: companyData.name,
          logo_url: logo_url,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      // Return a local-like object so UI can continue to function in dev
      return [
        {
          id: Math.floor(Math.random() * 100000),
          name: companyData.name,
          logo_url,
        },
      ];
    }

    return data;
  } catch (e) {
    console.warn("Unexpected insert error, returning local fallback:", e);
    return [
      {
        id: Math.floor(Math.random() * 100000),
        name: companyData.name,
        logo_url,
      },
    ];
  }
}

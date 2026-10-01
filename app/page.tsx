import Home from "@/components/Home/Home";
import React from "react";
import { fetchHomeData } from "@/lib/api-client";

// Dynamic SSR: re-render on every request while fetches use the framework
// data cache (see lib/api-client.ts).
export const dynamic = "force-dynamic";

const HomePage = async () => {
  const data = await fetchHomeData();
  return <Home data={data} />;
};

export default HomePage;
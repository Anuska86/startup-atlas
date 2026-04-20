import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function geocodeStartups() {
  // 1. Grab rows where lat is still NULL
  const { data: startups, error } = await supabase
    .from("startups_new")
    .select("id, all_locations")
    .is("lat", null)
    .limit(4000);

  if (error) {
    console.error("Error fetching data:", error);
    return;
  }

  console.log(`Found ${startups.length} startups to geocode...`);

  for (const startup of startups) {
    try {
      // 2. Ask the Map API for coordinates
      // We use the first location in the string

      if (!startup.all_locations) {
        console.log(`⏩ Skipping ID ${startup.id}: Location is empty.`);
        continue;
      }
      const query = startup.all_locations.split(",")[0];
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
        {
          headers: { "User-Agent": "StartupMapApp/1.0" },
        },
      );

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];

        // 3. Update the database
        const { error: updateError } = await supabase
          .from("startups_new")
          .update({ lat: parseFloat(lat), lng: parseFloat(lon) })
          .eq("id", startup.id);

        if (updateError) throw updateError;
        console.log(`✅ Updated ID ${startup.id}: ${query} -> ${lat}, ${lon}`);
      } else {
        console.log(`⚠️ No coordinates found for ID ${startup.id}: ${query}`);
      }

      // 4. IMPORTANT: Wait 1 second between requests (API rules)
      await new Promise((resolve) => setTimeout(resolve, 1200));
    } catch (err) {
      console.error(`❌ Failed on ID ${startup.id}:`, err.message);
    }
  }
  console.log("Batch complete!");
}

geocodeStartups();

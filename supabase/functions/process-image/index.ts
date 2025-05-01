
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Configure CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get OpenAI API key from environment variables
const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { prompt, imageUrls } = await req.json();

    if (!prompt || !imageUrls || imageUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: "Prompt and at least one image URL are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create a unique identifier for this generation
    const timestamp = new Date().toISOString();
    const randomId = crypto.randomUUID();
    const outputImageName = `generated-${timestamp}-${randomId}.png`;

    // Get the images from the provided URLs
    const imagePromises = imageUrls.map(async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image from ${url}`);
      }
      return await response.blob();
    });

    const imageBlobs = await Promise.all(imagePromises);

    // Prepare form data for OpenAI API
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("model", "gpt-image-1");
    
    // Add all image blobs to the request
    imageBlobs.forEach((blob, index) => {
      formData.append(`image_${index}`, blob);
    });

    // Call OpenAI API
    console.log("Calling OpenAI API with prompt:", prompt);
    const openaiResponse = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: formData,
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("OpenAI API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Error from OpenAI API", details: errorData }),
        {
          status: openaiResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const openaiData = await openaiResponse.json();
    
    // Check if we got b64_json data
    let generatedImageBlob: Blob;
    if (openaiData.data && openaiData.data[0].b64_json) {
      // Convert base64 to blob
      const base64Data = openaiData.data[0].b64_json;
      const binaryData = atob(base64Data);
      const uint8Array = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }
      generatedImageBlob = new Blob([uint8Array], { type: "image/png" });
    } else if (openaiData.data && openaiData.data[0].url) {
      // Download the generated image from URL
      const generatedImageUrl = openaiData.data[0].url;
      const generatedImageResponse = await fetch(generatedImageUrl);
      generatedImageBlob = await generatedImageResponse.blob();
    } else {
      throw new Error("No image data received from OpenAI API");
    }

    // Upload the generated image to Supabase Storage
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from("generated-images")
      .upload(outputImageName, generatedImageBlob, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: "Failed to upload generated image to storage" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the public URL for the uploaded image
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from("generated-images")
      .getPublicUrl(outputImageName);

    return new Response(
      JSON.stringify({
        success: true,
        generatedImageUrl: publicUrl,
        message: "Image processed and stored successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing image:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

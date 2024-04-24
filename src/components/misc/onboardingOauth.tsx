"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faDiscord, faGoogle } from "@fortawesome/free-brands-svg-icons";

import { Button } from "../ui/buttons/button";
import { baseURL } from "@/lib/constants";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useToast } from "../ui/use-toast";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function OnboardingOauth() {
  const supabase = createSupabaseClient()

  const searchParams = useSearchParams()

  const error = searchParams.get('error')

  const { toast, dismiss } = useToast()

  
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        toast({
          title: "Error",
          description: "There was an error, please try to resend again",
        })
      })
    }
  }, [])


  async function handleOAuthSignIn(e: any, provider: "discord" | "google" | "twitter") {
    e.preventDefault()
    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${baseURL}/api/confirm`
      } 
    })
    .catch((error) => {
      toast({
        title: "Error",
        description: "There was an error, please try to resend again",
      })
    })
  }

  return (
    <div className="flex flex-row w-full gap-x-4 pt-2">
      <Button variant="outline" size="icon" className="w-full" onClick={(e) => handleOAuthSignIn(e, 'twitter')}>
        <FontAwesomeIcon icon={faTwitter} className="w-[20px] h-[20px]" />
      </Button>
      <Button variant="outline" size="icon" className="w-full"  onClick={(e) => handleOAuthSignIn(e, 'discord')}>
        <FontAwesomeIcon icon={faDiscord} className="w-[20px] h-[20px]" />
      </Button>
      <Button variant="outline" size="icon" className="w-full" onClick={(e) => handleOAuthSignIn(e, 'google')}>
        <FontAwesomeIcon icon={faGoogle} className="w-[20px] h-[20px]" />
      </Button>
    </div>
  )
}
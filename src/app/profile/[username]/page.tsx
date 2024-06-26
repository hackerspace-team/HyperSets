
import { P, H2, Small, } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PresetCardList from "@/components/misc/lists/presets";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Avatar from "@/components/misc/avatar";
import { convertDate } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import BackgroundImage from "@/components/misc/background-image";
import ToolTip from "@/components/misc/tool-tip";
import Link from "next/link";
import { Tables } from "../../../../types/supabase";
import { PresetCardQueryResults } from "@/components/ui/cards/presets/preset";
import { calculateAverage } from "@/app/presets/[presetId]/page";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: {
    username: string
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const username = params.username
 
  return {
    title: `@${username} Profile - HyperSets`,
    description: "Explore HyperX presets made and uploaded by " + username
  }
}

export default async function Page({ params: { username } }: Props) {
  const supabase = await createSupabaseServerClient()

  const [{ data: currentUser }, { data: profile }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
    .from('profiles')
    .select('*, downloads(count), presets(count)')
    .eq('username', username)
    .single<ProfilePageQueryResults>()
  ])

  if (profile === null) {
    // In the future, redirect to a user not found page
    return (
      <div className="w-full h-full pt-48 items-center flex flex-col justify-center text-center">
        <P>Profile not found</P>
        <Link href="/presets">
          <Button variant="link">
            Back to presets
          </Button>
        </Link>
      </div>
    )
  }
  
  const [ratings, presets] = await Promise.all([
    supabase
      .from('presets')
      .select('ratings(rating)')
      .eq('profile_id', profile.profile_id)
      .then(({ data }) => {
        // Find the average for each preset and save it in an array
        let presetAverages: number[] = [];
        
        data ? data.forEach(({ ratings: presetRatings }) => {
          let transformedArray = presetRatings.map(item => item.rating)
          const avg = calculateAverage(transformedArray)

          if (avg === 0)
            return
          else
            return presetAverages.push(avg)
        }) : [0]

        const totalAverage = calculateAverage(presetAverages)

        return totalAverage
      }),
    supabase
      .from('presets')
      .select('*,profile:profile_id(username, avatar, name, profile_id)')
      .eq('profile_id', profile.profile_id)
      .order('views', { ascending: false })
      .returns<PresetCardQueryResults[]>()
      .then(({ data }) => data ?? [])
  ])
  
  
  return (
    <BackgroundImage img={profile.banner} alt={`${profile.username}'s profile banner`} gradient>
        <div className="h-full w-full min-h-[calc(100vh_-_57px)] pt-[130px]">
          {/* <---------- Profile Info ----------> */}
          <div className="max-w-screen-2xl container flex flex-col space-y-6 h-full pb-6">
            <div className="flex flex-col items-center space-y-5">
              <div className="flex flex-col justify-end items-center">
                <Avatar avatar={profile.avatar} name={profile.name} username={profile.username} classNames={'w-[160px] h-[160px]'} />
                <H2 classNames="mt-4 relative">{profile.name}</H2>
                <Small classNames="text-muted-foreground">@{profile.username}</Small>
              </div>
              <div className="md:w-full justify-center gap-x-2 h-full flex-col md:flex-row space-y-2 hidden md:flex">
                <div className="frosted flex gap-x-[3px] justify-center items-center">
                  <CalendarIcon className="w-5 h-5" />
                  <Small classNames=""> Member Since: {convertDate(profile.created_on as string)}</Small>
                </div>

              </div>
              <div className="max-w-[500px]  text-center text-muted-foreground">
                <P>{profile.bio}</P>
              </div>
              {/* <Small classNames="text-muted-foreground">Member Since: {convertDate(profile.created_on as string)}</Small> */}
            </div>

            <div className="flex flex-row gap-10 mx-auto text-center">
              <div className="">
                {/* # of Downloads */}
                <P>Downloads</P>
                <H2>{profile.downloads !== undefined ? profile.downloads[0].count : 0}</H2>
              </div>
              <div className="">
                {/* Average Rating */}
                <P>Average Rating</P>
                <H2>{ratings}</H2>
              </div>
              <div className="">
                {/* # of Presets Made */}
                <P>Presets Made</P>
                <H2>{profile.presets !== undefined ? profile.presets[0].count : 0}</H2>
              </div>
            </div>
          </div>
          <PresetCardList serverPresets={presets} profile_id={profile.profile_id} />
        </div>
    </BackgroundImage>

  )
}

export interface ProfilePageQueryResults extends Tables<'profiles'> {
  downloads: { count: number }[]
  presets: { count: number }[]
}
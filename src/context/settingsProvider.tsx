"use client"

import { createContext, useState } from "react"
import { createSupabaseClient } from "../lib/supabase/client"
import { Provider, User, UserIdentity } from "@supabase/supabase-js"
import { Tables } from "../../types/supabase"
import { PUBLIIC_CDN_URL } from "../lib/constants"
import { PresetCardQueryResults } from "@/components/ui/cards/presets/preset"
import { FormMode } from "@/components/misc/pages/settings/settings-form"
import { ToastTitles } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"

export type TSettingsContext = {
  mode: FormMode,
  security: User,
  tmpIdentities: UserIdentity[],
  tmpAvatar: string | null,
  tmpBanner: string | null,
  profile: Tables<'profiles'>,
  presets: PresetCardQueryResults[],
  notificationPref: Tables<'notifications_prefrences'>,
  removePreset(preset_id: number): void
  updateData<T extends keyof TSettingsContext, D = TSettingsContext[T]>(type: T, data: D): void,
  updateImages(type: 'avatar' | 'banner', path: string | null): void,
  refreshPresets(): Promise<void>
}

export const SettingsContext = createContext<Partial<TSettingsContext>>({})

type Props = {
  security: User,
  children: React.ReactNode,
  profile: Tables<'profiles'>,
  presets: PresetCardQueryResults[],
  notificationPreferences: Tables<'notifications_prefrences'>
}

export default function SettingsProvider({ children, notificationPreferences, profile: initialProfile, security: initalSecurity, presets: initalPresets }: Props) {
  const supabase = createSupabaseClient()

  const [mode, setMode] = useState<FormMode>('view')

  const [notificationPref, setNotitifcationPref] = useState(notificationPreferences)
  const [profile, setProfile] = useState(initialProfile)
  const [security, setSecurity] = useState(initalSecurity)
  const [presets, setPresets] = useState(initalPresets)

  const [tmpAvatar, setTmpAvatar] = useState<string | null>(null)
  const [tmpBanner, setTmpBanner] = useState<string | null>(null)

  const [tmpIdentities, setTmpIdentities] = useState<UserIdentity[]>([])
  
  const { toast } = useToast()

  function updateData<T extends keyof TSettingsContext, D = TSettingsContext[T]>(type: T, data: D) {
    switch(type) {
      case 'notificationPref':
        setNotitifcationPref(data as TSettingsContext['notificationPref'])
        break;
      case 'profile':
        setProfile(data as TSettingsContext['profile'])
        break;
      case 'security':
        setSecurity(data as TSettingsContext['security'])
        break;
      case 'presets':
        setPresets(data as TSettingsContext['presets'])
      case 'tmpIdentities':
        setTmpIdentities(data as TSettingsContext['tmpIdentities'])
      case 'tmpAvatar':
        setTmpAvatar(data as TSettingsContext['tmpAvatar'])
        break;
      case 'tmpBanner':
        setTmpBanner(data as TSettingsContext['tmpBanner'])
        break;
      default:
        break;
    }
  }

  function updateImages(type: 'avatar' | 'banner', src: string | null) {
    switch (type) {
      case 'avatar':
        setTmpAvatar(src)
        break;
      case 'banner':
        setTmpBanner(src)
        break;
      default:
        break;
    }
  }

  async function refreshPresets() {
    if (security === null || security.user_metadata.profile_id)
      return

    const { data, error } = await supabase
      .from('presets')
      .select('*, profile:profile_id(profile_id, username, avatar, name)')
      .eq('profile_id', security.user_metadata.profile_id)
      .returns<PresetCardQueryResults[] | null>()
    
    setPresets(data ?? [])
  }

  function removePreset(preset_id: number) {
    const newArray = presets.filter(preset => preset.preset_id !== preset_id)
    setPresets(newArray)
  }
  return (
    <SettingsContext.Provider value={{
      mode,
      profile,
      security,
      presets,
      updateData,
      tmpAvatar,
      updateImages,
      tmpBanner,
      notificationPref,
      tmpIdentities,
      refreshPresets,
      removePreset
    }}>
      {children}
    </SettingsContext.Provider>
  )
}



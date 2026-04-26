"use client"

import { ProfileTab, TemaTab, type SettingsUser } from "@/components/pengaturan/pengaturan-content"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type PengaturanCashierContentProps = {
  currentUser: SettingsUser | null
}

export function PengaturanCashierContent({ currentUser }: PengaturanCashierContentProps) {
  const displayUser = currentUser ?? {
    id: "",
    name: "Pengguna",
    email: "-",
    role: "cashier",
    banned: false,
  }

  return (
    <div className="flex flex-1 min-w-0 min-h-0 flex-col gap-3 overflow-y-auto p-4 lg:gap-6 lg:p-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">
          Kelola profil pengguna dan tema aplikasi.
        </p>
      </div>

      <Tabs defaultValue="profile" className="gap-4">
        <TabsList className="w-full justify-start overflow-x-auto rounded-2xl p-1 sm:w-fit">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="tema">Tema</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="m-0">
          <ProfileTab displayUser={displayUser} />
        </TabsContent>

        <TabsContent value="tema" className="m-0">
          <TemaTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

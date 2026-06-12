import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { StudyTimerProvider } from "@/components/StudyTimerProvider";
import { StudyTimerPill } from "@/components/StudyTimerPill";

function AuthenticatedLayout() {
  return (
    <StudyTimerProvider>
      <Outlet />
      <StudyTimerPill />
    </StudyTimerProvider>
  );
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) throw redirect({ to: "/auth" });
    return { user: data.session.user };
  },
  component: AuthenticatedLayout,
});

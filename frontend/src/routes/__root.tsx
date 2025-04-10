import {
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "~/components/ui/sonner";
import { QueryClient } from "@tanstack/react-query";
import { NavMain } from "~/components/nav-main";
import Footer from "~/components/footer";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: RootComponent,
  }
);

function RootComponent() {

  return (
    <>
      <Toaster />
      <div className="flex min-h-screen flex-col">
        <NavMain />
        <main className="flex-1 container py-4 items-center justify-between">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}

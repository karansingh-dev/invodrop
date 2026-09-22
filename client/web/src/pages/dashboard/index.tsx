import { Button } from "@/components/ui/button";
import { useBetterAuth } from "@/hooks/better-auth";




function Dashboard() {

    const { signOut, isSigningOut } = useBetterAuth();


    return <div>

        {/* topbar  */}
        <div className=" p-4 fixed top-0 w-full flex justify-between">
            <div>
                Dashboard
            </div>

            <Button variant="secondary" type="button" onClick={signOut}>
                {isSigningOut ? "Signing Out ..." : "Sign Out"}
            </Button>

        </div>
    </div>
}

export default Dashboard;
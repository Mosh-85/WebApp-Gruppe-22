import { RequestInfo } from "rwsdk/worker";
import VippsSims from "./VippsSims";
import ReactEmail from "./ReactEmail";
import { AppContext } from "./worker";
import AdminLandingPage from "./AdminLandingPage";

interface HomeProps {
  ctx: AppContext;
}

function Home({ ctx }: HomeProps) {
  return (
    <div>
      <p>
        {ctx.user?.username
          ? `You are logged in as user ${ctx.user.username}`
          : "You are not logged in ##"}
      </p>
        <section>
        <AdminLandingPage />
        </section>
      </div>
  );
}

export default Home;

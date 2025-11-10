import { RequestInfo } from "rwsdk/worker";
import VippsSims from "./VippsSims";
import ReactEmail from "./ReactEmail";
import { AppContext } from "../worker";
import AdminLandingPage from "./AdminLandingPage";
import Kalender from "./Kalender";
import Innstillinger from "./Innstillinger";
import FunctionConfirmationOfBooking from "./FunctionConfirmationOfBooking";
import FunctionResend from "./FunctionResend";
import { BookingInfo } from "./BookingInfo";
import ModifiserBord from "./ModifiserBord";

interface HomeProps {
  ctx: AppContext;
}

function Home({ ctx }: HomeProps) {
  return (
    <div>
      <p>
        {ctx.user?.name
          ? `You are logged in as user ${ctx.user.name}`
          : "You are not logged in ##"}
      </p>
        <section>
        <AdminLandingPage />
        <Kalender />
        <Innstillinger />
        <FunctionConfirmationOfBooking />
        <FunctionResend />
        <BookingInfo />
        <ReactEmail />
        <VippsSims />
        <ModifiserBord />
        </section>
      </div>
  );
}

export default Home;

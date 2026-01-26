import Header from "../components/AppHeader";
import SummarizerPage from "./summarizer/SummarizerPage";

const HomePage = () => {
    return (
        <main className="min-h-screen w-full  bg-muted relative ">
            {/* <Header/> */}
            <SummarizerPage/>
        </main>
    )
}
export default HomePage;
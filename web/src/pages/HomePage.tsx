import Header from "../components/app-header";
import SummarizerPage from "./summarizer/SummarizerPage";

const HomePage = () => {
    return (
        <main className="min-h-screen w-full  bg-muted relative ">
            <Header/>
            <SummarizerPage/>
        </main>
    )
}
export default HomePage;
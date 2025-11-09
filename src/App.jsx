import { Header } from "./components/header";
import { Map } from "./components/map";

function App() {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-start justify-start bg-background">
        <div className="w-full h-full">
          <Map />
        </div>
      </main>
    </>
  );
}

export default App;

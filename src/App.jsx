import { Button } from "@/components/ui/button";
import { Header } from "./components/header";

function App() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to StreetSmart
        </h1>
        <Button>Click me</Button>
      </main>
    </>
  );
}

export default App;

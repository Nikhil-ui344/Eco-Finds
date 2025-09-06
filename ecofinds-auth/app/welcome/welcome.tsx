import logo from "./EcoFinder.png";

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
        <header className="flex flex-col items-center gap-6">
          <div className="w-[220px] max-w-[80vw] p-2">
            <img src={logo} alt="EcoFinds" className="block w-full" />
          </div>
        </header>
      </div>
    </main>
  );
}

// No extra content to keep this lean and avoid missing assets

import PresentationForm from "@/components/presentation-form"
import Header from "@/components/header"

export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4 pt-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">Registro para Ponencia</h1>
          <PresentationForm />
        </div>
      </main>
    </>
  )
}


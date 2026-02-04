import Button from "../components/common/Button.jsx"

export default function Landing() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text space-y-6">
      <h1 className="text-3xl font-bold">Select a Page</h1>
      <div className="flex space-x-4">
        <Button text="Authentication Page" to="/authentication" />
        <Button text="Overview Page" to="/overview" />
      </div>
    </div>
  )
}
import './App.css'
import { Button } from './components/ui/button'

function App() {

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold underline'>Hello World</h1>
      <Button onClick={() => alert('Button clicked')}>Click me</Button>
    </div>
  )
}

export default App

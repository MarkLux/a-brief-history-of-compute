import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProgressProvider } from './components/ProgressContext'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { LessonPage } from './pages/LessonPage'

function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="lesson/:id" element={<LessonPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  )
}

export default App

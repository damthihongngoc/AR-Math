import { Suspense } from 'react'
import { Route, Routes } from 'react-router'
import AppLayout from 'src/components/AppLayout'
import AppLoading from 'src/components/AppLoading'
import Home from 'src/pages/Home'
import Practice from 'src/pages/Practice'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<AppLoading />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="practice/*"
          element={
            <Suspense fallback={<AppLoading />}>
              <Practice />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}

export default App

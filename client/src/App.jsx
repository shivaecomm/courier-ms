import { lazy, Suspense } from 'react';
import './App.css';
import { BeatLoader } from 'react-spinners';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import BranchStaff from './pages/BranchStaff';


const Home = lazy(() => import('./pages/Home'));
const NewBranch = lazy(() => import('./pages/NewBranch'));
const ShippingLabelForm = lazy(() => import('./pages/ShippingLabelForm'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const ManageBranch = lazy(() => import('./pages/ManageBranch'));

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="loader-container">
              <BeatLoader color="#36d7b7" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/newBranch" element={<NewBranch />} />
            <Route path="/manage-branch" element={<ManageBranch />} />
            <Route path="/branch-staff" element={<BranchStaff />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shippingLabel" element={<ShippingLabelForm />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
};

export default App;

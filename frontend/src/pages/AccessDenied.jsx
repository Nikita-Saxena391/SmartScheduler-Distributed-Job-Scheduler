import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaLock,
  FaUserShield,
  FaArrowLeft,
  FaExclamationTriangle,
} from "react-icons/fa";

function AccessDenied() {
  const role = localStorage.getItem("role") || "User";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl overflow-hidden">

        {/* Header */}
       

          <div className="bg-red-600 text-white py-5 px-6 text-center">
  <div className="flex justify-center mb-2">
    <div className="bg-white/20 p-3 rounded-full">
      <FaShieldAlt className="text-4xl" />
    </div>
  </div>

  <h1 className="text-5xl font-extrabold">403</h1>

  <h2 className="text-2xl font-bold mt-1">
    Access Denied
  </h2>

  <p className="text-red-100 text-sm mt-1">
    You don't have permission to access this page.
  </p>
</div>

        {/* Body */}
        <div className="p-8">

          {/* Current Role */}
          <div className="flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <FaUserShield className="text-white text-2xl" />
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Logged in as
              </p>

              <h3 className="text-xl font-bold capitalize text-blue-700">
                {role}
              </h3>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-5">
            <div className="flex items-start gap-4">
              <FaExclamationTriangle className="text-red-600 text-3xl mt-1" />

              <div>
                <h3 className="font-bold text-red-700 text-lg">
                  Administrator Access Required
                </h3>

                <p className="text-gray-700 mt-2">
                  This section is restricted to users with
                  <strong> Administrator </strong>
                  privileges only.
                </p>

                <p className="text-gray-600 mt-2">
                  Your current account doesn't have sufficient permissions
                  to view or manage this resource.
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 flex items-center gap-3 bg-gray-100 rounded-lg p-4">
            <FaLock className="text-gray-600 text-2xl" />

            <p className="text-gray-600">
              If you believe this is a mistake, please contact your system
              administrator to request the required permissions.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-8">

            <Link
              to="/dashboard"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-semibold"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900 text-white text-center py-5">
          <p className="font-semibold">
            ❤️ Built with Love by Nikita Saxena
          </p>

          <p className="text-slate-300 text-sm mt-1">
            RA2311008020011 | SmartScheduler
          </p>

          <p className="text-slate-400 text-xs mt-2">
            © {new Date().getFullYear()} SmartScheduler. All Rights Reserved.
          </p>
        </div>

      </div>
    </div>
  );
}

export default AccessDenied;
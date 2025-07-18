import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SankeyMChart from "../components/SankeyMChart";
import heroImage from "../components/productivity-improvement-strategies.png";
import { Button } from "../components/ui/button";
import { FaRegFileAlt, FaChartLine, FaRocket } from "react-icons/fa";

const LandingPage = () => {
  const { user, token } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center px-8 py-20 gap-12">
          <div className="max-w-xl text-left">
            <h1 className="text-5xl font-bold mb-6">
              Generate <span className="text-blue-600">Tailored</span> Cover Letters Instantly
            </h1>
            <p className="text-lg mb-8 leading-relaxed">
              Stop wasting time and start applying confidently with AI-powered cover letters that match job postings and highlight your unique strengths.
            </p>
            <div className="space-x-4">
              <Link to="/register">
                <Button className="px-6 py-3 bg-blue-600 text-white text-lg hover:bg-blue-700">
                  Create your first Cover Letter!
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="px-6 py-3 text-lg">
                  Already have an account?
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <img src={heroImage} alt="Cover Letter AI Generator" className="w-full max-w-md mx-auto" />
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gray-50 py-16 px-8">
          <h2 className="text-4xl font-semibold text-center mb-12">
            Why Use Our Platform?
          </h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
              <FaRegFileAlt size={48} className="text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Personalized Cover Letters</h3>
              <p className="text-gray-700">
                Our AI tailors each cover letter to the specific job description, helping you stand out by highlighting your unique skills and experience.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
              <FaChartLine size={48} className="text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Track Your Applications</h3>
              <p className="text-gray-700">
                Organize and visualize your job applications effortlessly. Stay on top of deadlines, responses, and next steps with an intuitive dashboard.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
              <FaRocket size={48} className="text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Apply Faster & Smarter</h3>
              <p className="text-gray-700">
                Save time with AI automation and focus on preparing for interviews. Our platform streamlines your job search journey from start to success.
              </p>
            </div>
          </div>
        </section>

        {/* CTA section// GET STARTED!! */}
        <section className="py-16 px-8 text-center">
          <h2 className="text-3xl font-semibold mb-6">Ready to Boost Your Job Search?</h2>
          <Link to="/register">
            <Button className="px-8 py-4 bg-blue-600 text-white text-xl hover:bg-blue-700">
              Get Started Now
            </Button>
          </Link>
        </section>
      </div>
    );
  }

  // show logged-in user view
  return (
    <div className="max-w-5xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        Welcome back!
      </h1>
      <p className="mb-6 text-gray-700">Here's a visual breakdown of your applications:</p>
      <SankeyMChart token={token} />
    </div>
  );
};

export default LandingPage;

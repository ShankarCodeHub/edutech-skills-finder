import React from "react";
import { FaArrowRight } from "react-icons/fa";

const courses = [
  { 
    name: "Intro to Python", 
    platform: "Coursera", 
    cost: "Free", 
    image: "https://tse3.mm.bing.net/th/id/OIP.rz21EqzUMBEZcyymKKZuMAHaEK?pid=Api&P=0&h=180",
    url: "https://www.coursera.org/learn/python"
  },
  { 
    name: "SQL Basics", 
    platform: "Udemy", 
    cost: "Paid", 
    image: "https://tse1.mm.bing.net/th/id/OIP.5F0S9Lr7ycWAmkX9oCh45AHaEK?pid=Api&P=0&h=180",
    url: "https://www.udemy.com/topic/sql/"
  },
  { 
    name: "Machine Learning A-Z", 
    platform: "edX", 
    cost: "Paid", 
    image: "https://tse3.mm.bing.net/th/id/OIP.AbOaGJdhg7F4xIe94ap49gHaD_?pid=Api&P=0&h=180",
    url: "https://www.edx.org/learn/machine-learning"
  },
  { 
    name: "Deep Learning Specialization", 
    platform: "Coursera", 
    cost: "Paid", 
    image: "https://tse3.mm.bing.net/th/id/OIP.5IxRfuwEz37bq3SDJvFvLwHaD4?pid=Api&P=0&h=180",
    url: "https://www.coursera.org/specializations/deep-learning"
  },
  { 
    name: "JavaScript Essentials", 
    platform: "Pluralsight", 
    cost: "Free", 
    image: "https://tse4.mm.bing.net/th/id/OIP.FFMK3rTBCxEQ7kG84kH0LQAAAA?pid=Api&P=0&h=180",
    url: "https://www.pluralsight.com/courses/javascript-fundamentals"
  },
];

const platformColors = {
  Coursera: "bg-blue-500",
  Udemy: "bg-red-600",
  edX: "bg-green-600",
  Pluralsight: "bg-purple-700",
};

export default function Courses() {
  return (
    <section id="courses" className="mb-12">
      <h2 className="font-bold text-3xl mb-8 text-purple-700 text-center">Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, idx) => (
          <div key={idx} className="group relative bg-gradient-to-br from-purple-50/90 via-white/80 to-purple-100/90 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden flex flex-col transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 border-2 border-purple-200/50 hover:border-purple-400">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 via-purple-300/0 to-purple-500/0 group-hover:from-purple-400/10 group-hover:via-purple-300/5 group-hover:to-purple-500/10 transition-all duration-500"></div>
            <div className="relative overflow-hidden">
              <img
              src={course.image}
              alt={`${course.name} cover`}
              className="w-full h-48 object-cover transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
              loading="lazy"
            />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="relative p-6 flex flex-col flex-grow">
              <h3 className="font-bold text-2xl mb-3 text-purple-900 group-hover:text-purple-700 transition-colors duration-300">{course.name}</h3>
              <div className="flex items-center space-x-3 mb-6">
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white px-3 py-1 rounded-full text-sm cursor-pointer hover:opacity-80 transition-opacity ${platformColors[course.platform] || "bg-gray-400"}`}
                  title={`View on ${course.platform}`}
                >
                  {course.platform}
                </a>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-semibold px-3 py-1 rounded-full text-sm cursor-pointer hover:opacity-80 transition-opacity ${
                    course.cost === "Free" ? "bg-green-500 text-white" : "bg-yellow-400 text-gray-800"
                  }`}
                  title={`${course.cost} course - Click to view`}
                >
                  {course.cost}
                </a>
              </div>
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold rounded-xl py-4 px-6 flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 shadow-lg group relative overflow-hidden"
              >
                <span className="relative z-10 text-lg">Enroll Now</span>
                <span className="relative z-10 flex items-center">
                  <FaArrowRight className="transition-all duration-500 group-hover:translate-x-2 group-hover:scale-125 group-hover:rotate-[-15deg]" />
                  <FaArrowRight className="absolute transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-4 group-hover:scale-110" />
                  <FaArrowRight className="absolute transition-all duration-700 opacity-0 group-hover:opacity-50 group-hover:translate-x-6 group-hover:scale-90" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

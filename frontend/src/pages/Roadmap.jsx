import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const roadmap = [
	{
		title: "Python Basics",
		steps: [
			"Learn syntax, variables, and data types",
			"Practice loops and conditionals",
			"Explore functions and modules",
			"Work with NumPy and Pandas",
		],
	},
	{
		title: "SQL Fundamentals",
		steps: [
			"Understand databases and tables",
			"Master SELECT, INSERT, UPDATE, DELETE",
			"Learn JOINs and GROUP BY",
			"Practice with real-world queries",
		],
	},
	{
		title: "Machine Learning",
		steps: [
			"Study ML algorithms and concepts",
			"Use scikit-learn for modeling",
			"Data preprocessing and feature engineering",
			"Build and evaluate ML projects",
		],
	},
];

export default function RoadmapPage() {
	return (
		<>
			<Navbar />
			<section className="max-w-3xl mx-auto py-16 px-4">
				<h1 className="text-4xl font-extrabold mb-8 text-purple-700 text-center">
					Skill Roadmap
				</h1>
				<div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
					<Link
						to="/python-roadmap"
						className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold shadow hover:scale-105 transition text-lg"
					>
						Python Roadmap
					</Link>
					<Link
						to="/sql-roadmap"
						className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold shadow hover:scale-105 transition text-lg"
					>
						SQL Roadmap
					</Link>
					<Link
						to="/ml-roadmap"
						className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold shadow hover:scale-105 transition text-lg"
					>
						ML Roadmap
					</Link>
				</div>
				<div className="space-y-12">
					{roadmap.map((section, idx) => (
						<div
							key={section.title}
							className="relative bg-white/90 rounded-3xl shadow-2xl border border-purple-200 p-8 flex flex-col items-start"
						>
							{/* Decorative gradient blob */}
							<div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-purple-400/30 blur-[60px] animate-blob" />
							<div className="pointer-events-none absolute bottom-0 left-1/2 w-24 h-24 rounded-full bg-purple-300/30 blur-[40px] animate-blob delay-2000" />
							<h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
								<span className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-300 text-white grid place-items-center font-bold mr-2">
									{idx + 1}
								</span>
								{section.title}
							</h2>
							<ol className="list-decimal ml-8 space-y-3 text-purple-900 text-lg">
								{section.steps.map((step, i) => (
									<li key={i} className="relative pl-2">
										<span className="absolute -left-6 top-1.5 h-3 w-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow" />
										{step}
									</li>
								))}
							</ol>
						</div>
					))}
				</div>
			</section>
			<Footer />
		</>
	);
}

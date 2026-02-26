import React from 'react';

const pricingPlans = [
	{
		name: 'Basic',
		bestFor: 'SMBs / Startups',
		monthly: '₹75,000',
		annual: '₹7,92,000',
		includedUsers: 'Up to 10',
		extraUserCost: '₹3,000 / user',
	},
	{
		name: 'Enterprise',
		bestFor: 'Mid–Large Orgs',
		monthly: '₹2,00,000',
		annual: '₹21,12,000',
		includedUsers: 'Up to 100',
		extraUserCost: '₹1,500 / user',
	},
	{
		name: 'Customized',
		bestFor: 'Large / Regulated',
		monthly: '₹3,50,000+',
		annual: 'Custom Quote',
		includedUsers: 'Custom',
		extraUserCost: 'Custom',
	},
];

const features = [
	{
		name: 'Task & Workflow Management',
		trial: true,
		basic: true,
		enterprise: true,
		customized: true,
	},
	{
		name: 'Realtime Collaboration',
		trial: true,
		basic: true,
		enterprise: true,
		customized: true,
	},
	{
		name: 'Standard Integrations (Email, Chat)',
		trial: true,
		basic: true,
		enterprise: true,
		customized: true,
	},
	{
		name: 'Automation Rules',
		trial: 'Limited',
		basic: 'Standard',
		enterprise: 'Advanced',
		customized: 'Unlimited',
	},
	{
		name: 'Reporting & Dashboards',
		trial: 'Basic',
		basic: 'Standard',
		enterprise: 'Advanced',
		customized: 'Custom',
	},
	{
		name: 'User Roles & Permissions',
		trial: 'Limited',
		basic: true,
		enterprise: true,
		customized: true,
	},
	{
		name: 'Audit Logs',
		trial: false,
		basic: false,
		enterprise: true,
		customized: true,
	},
	{
		name: 'SSO / SCIM',
		trial: false,
		basic: false,
		enterprise: true,
		customized: true,
	},
	{
		name: 'SLA',
		trial: false,
		basic: false,
		enterprise: '99.9%',
		customized: 'Custom (99.9%–99.99%)',
	},
	{
		name: 'Support',
		trial: 'Email',
		basic: 'Email',
		enterprise: '24×7 Priority',
		customized: 'Dedicated Team',
	},
	{
		name: 'Dedicated Infrastructure',
		trial: false,
		basic: false,
		enterprise: false,
		customized: true,
	},
];

const featureTags = [
	'Task Management',
	'Project Management',
	'Time Tracking',
	'Workflow Automation',
	'Document Management',
	'Attendance Tracking',
	'Leave Management',
	'Collaboration',
];

export default function SignupPage() {
	return (
		<div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-background via-background to-primary/5">
			{/* Left: Illustration & Welcome */}
			<div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-primary/10 to-accent/10 p-8 md:rounded-r-[3rem] shadow-2xl relative overflow-hidden min-h-[480px]">
				<div className="w-full max-w-4xl mx-auto">
					<div className="flex flex-wrap gap-4 justify-center items-stretch">
						{/* Free Card */}
						<div className="flex-1 bg-white/90 rounded-2xl shadow-xl border border-border p-3 flex flex-col items-center min-w-[150px] max-w-[200px]">
							<h3 className="text-xl font-semibold mb-2 text-primary">Free</h3>
							<div className="text-3xl font-bold text-primary mb-1">₹0</div>
							<div className="text-xs text-muted-foreground mb-4">
								Individuals / Evaluation
							</div>
							<ul className="text-sm text-left space-y-2 mb-6 w-full">
								<li className="flex items-center gap-2">
									<span className="text-success">✔</span> Up to 3 users
								</li>
								<li className="flex items-center gap-2">
									<span className="text-success">✔</span> All core features
								</li>
								<li className="flex items-center gap-2">
									<span className="text-success">✔</span> No cost, no credit card
								</li>
							</ul>
							<button className="mt-auto bg-gradient-to-r from-primary to-accent text-white font-semibold px-6 py-2 rounded-full shadow hover:scale-105 transition">
								Start Free
							</button>
						</div>
						{/* Basic Card */}
						<div className="flex-1 bg-white rounded-2xl shadow-xl border border-primary/30 p-3 flex flex-col items-center min-w-[150px] max-w-[200px]">
							<h3 className="text-xl font-semibold mb-2 text-primary">Basic</h3>
							<div className="text-3xl font-bold text-primary mb-1">₹75,000</div>
							<div className="text-xs text-muted-foreground mb-4">SMBs / Startups</div>
							<ul className="text-sm text-left space-y-2 mb-6 w-full">
								<li className="flex items-center gap-2">
									<span className="text-success">✔</span> Up to 10 users
								</li>
								<li className="flex items-center gap-2">
									<span className="text-success">✔</span> ₹3,000 / extra user
								</li>
								<li className="flex items-center gap-2">
									<span className="text-success">✔</span> All features included
								</li>
							</ul>
							<button className="mt-auto bg-gradient-to-r from-primary to-accent text-white font-semibold px-6 py-2 rounded-full shadow hover:scale-105 transition">
								Buy Now
							</button>
						</div>
						{/* Enterprise Card (Highlighted) */}
						<div className="flex-1 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-2xl border-4 border-primary/60 p-4 flex flex-col items-center min-w-[170px] max-w-[220px] relative scale-105 z-10">
							<h3 className="text-xl font-semibold mb-2 text-white">Enterprise</h3>
							<div className="text-3xl font-bold text-white mb-1">₹2,00,000</div>
							<div className="text-xs text-white/80 mb-4">Mid–Large Orgs</div>
							<div className="flex items-center gap-2 mb-2">
								<span className="bg-yellow-300 text-primary font-bold px-2 py-1 rounded-full text-xs">
									12% Off
								</span>
								<span className="bg-white text-primary font-semibold px-2 py-1 rounded-full text-xs">
									Most Recommended
								</span>
							</div>
							<ul className="text-sm text-left space-y-2 mb-6 w-full text-white">
								<li className="flex items-center gap-2">
									<span className="text-success">✔</span> Up to 100 users
								</li>
								<li className="flex items-center gap-2">
									<span className="text-success">✔</span> ₹1,500 / extra user
								</li>
								<li className="flex items-center gap-2">
									<span className="text-success">✔</span> All features included
								</li>
							</ul>
							<button className="mt-auto bg-white text-primary font-bold px-6 py-2 rounded-full shadow hover:scale-105 transition">
								Buy Now
							</button>
						</div>
						{/* Customized Card */}
						<div className="flex-1 bg-white rounded-2xl shadow-xl border border-primary/30 p-3 flex flex-col items-center min-w-[150px] max-w-[200px]">
							<h3 className="text-xl font-semibold mb-2 text-primary">Customized</h3>
							<div className="text-3xl font-bold text-primary mb-1">₹3,50,000+</div>
							<div className="text-xs text-muted-foreground mb-4">Large / Regulated</div>
							<ul className="text-sm text-left space-y-2 mb-6 w-full">
								<li className="flex items-center gap-2">
									<span className="text-success">✔</span> Custom user limits
								</li>
								<li className="flex items-center gap-2">
									<span className="text-success">✔</span> Custom features
								</li>
								<li className="flex items-center gap-2">
									<span className="text-success">✔</span> Custom quote
								</li>
							</ul>
							<button className="mt-auto bg-gradient-to-r from-primary to-accent text-white font-semibold px-6 py-2 rounded-full shadow hover:scale-105 transition">
								Contact Us
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Right: Signup Form */}
			<div className="flex-1 flex flex-col justify-center items-center p-6">
				<div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-8 border border-border">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center shadow-lg">
							<span className="text-primary-foreground font-heading font-bold text-xl">
								N
							</span>
						</div>
						<div>
							<h2 className="text-xl font-heading font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
								NextGenTask
							</h2>
							<p className="text-xs font-caption text-accent font-semibold tracking-wide">
								Manager
							</p>
						</div>
					</div>
					<h3 className="text-xl font-bold mb-2">Sign Up</h3>
					<p className="text-sm text-muted-foreground mb-6">
						Create your account to get started.
					</p>
					<form className="grid grid-cols-1 gap-4">
						<input
							type="text"
							placeholder="User Name"
							className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
							required
						/>
						<input
							type="email"
							placeholder="Email ID"
							className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
							required
						/>
						<input
							type="text"
							placeholder="Organization Name"
							className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
							required
						/>
						<input
							type="text"
							placeholder="Address"
							className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
							required
						/>
						<input
							type="text"
							placeholder="State"
							className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
							required
						/>
						<input
							type="text"
							placeholder="City"
							className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
							required
						/>
						<input
							type="text"
							placeholder="Pin"
							className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
							required
						/>
						<input
							type="text"
							placeholder="Contact No"
							className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
							required
						/>
						<input
							type="number"
							placeholder="Team Size"
							className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
							required
						/>
						<select
							className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
							required
						>
							<option value="">Subscription Type</option>
							<option value="Free">Free</option>
							<option value="Basic">Basic</option>
							<option value="Enterprise">Enterprise</option>
							<option value="Customized">Customized</option>
						</select>
						<button
							type="submit"
							className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 mt-2"
						>
							Sign Up
						</button>
					</form>
				</div>
				<footer className="mt-8 text-xs text-muted-foreground text-center opacity-80">
					<div className="flex flex-wrap gap-4 justify-center">
						<span>Support</span>
						<span>Resources</span>
						<span>Guide</span>
						<span>Pricing</span>
						<span>Terms</span>
						<span>Privacy</span>
					</div>
					<div className="mt-2">
						&copy; 2026 powered by Quantum Vertex Solutions. All rights reserved.
					</div>
				</footer>
			</div>
		</div>
	);
}
